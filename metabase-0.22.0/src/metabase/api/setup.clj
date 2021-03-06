(ns metabase.api.setup
  (:require [compojure.core :refer [GET POST]]
            [medley.core :as m]
            [schema.core :as s]
            (metabase.api [common :refer :all]
                          [database :refer [DBEngine]])
            (metabase [db :as db]
                      [driver :as driver]
                      [email :as email]
                      [events :as events])
            [metabase.integrations.slack :as slack]
            (metabase.models [database :refer [Database]]
                             [session :refer [Session]]
                             [setting :as setting]
                             [user :refer [User set-user-password!]])
            [metabase.public-settings :as public-settings]
            [metabase.setup :as setup]
            [metabase.util :as u]
            [metabase.util.schema :as su]))

(def ^:private SetupToken
  "匹配实例Token"
  (su/with-api-error-message (s/constrained su/NonBlankString setup/token-match?)
    "Token不匹配"))


(defendpoint POST "/"
  " 在安装过程中会创建一个特殊的端点。
    这个端点将用来创建用户，记录它们并返回会话ID。"
  [:as {{:keys [token] {:keys [name engine details is_full_sync]} :database, {:keys [first_name last_name email password]} :user, {:keys [allow_tracking site_name]} :prefs} :body, :as request}]
  {token      SetupToken
   site_name  su/NonBlankString
   first_name su/NonBlankString
   last_name  su/NonBlankString
   email      su/Email
   password   su/ComplexPassword}
  ;; Call (public-settings/site-url request) to set the Site URL setting if it's not already set
  (public-settings/site-url request)
  ;; Now create the user
  (let [session-id (str (java.util.UUID/randomUUID))
        new-user   (db/insert! User
                     :email        email
                     :first_name   first_name
                     :last_name    last_name
                     :password     (str (java.util.UUID/randomUUID))
                     :is_superuser true)]
    ;; this results in a second db call, but it avoids redundant password code so figure it's worth it
    (set-user-password! (:id new-user) password)
    ;; set a couple preferences
    (public-settings/site-name site_name)
    (public-settings/admin-email email)
    (public-settings/anon-tracking-enabled (if (m/boolean? allow_tracking)
                                             allow_tracking
                                             true)) ; default to `true` if allow_tracking isn't specified
    ;; setup database (if needed)
    (when (driver/is-engine? engine)
      (->> (db/insert! Database
             :name         name
             :engine       engine
             :details      details
             :is_full_sync (if-not (nil? is_full_sync)
                             is_full_sync
                             true))
           (events/publish-event! :database-create)))
    ;; clear the setup token now, it's no longer needed
    (setup/clear-token!)
    ;; then we create a session right away because we want our new user logged in to continue the setup process
    (db/insert! Session
      :id      session-id
      :user_id (:id new-user))
    ;; notify that we've got a new user in the system AND that this user logged in
    (events/publish-event! :user-create {:user_id (:id new-user)})
    (events/publish-event! :user-login {:user_id (:id new-user), :session_id session-id, :first_login true})
    {:id session-id}))


(defendpoint POST "/validate"
  "我们可以连接一组数据库。"
  [:as {{{:keys [engine] {:keys [host port] :as details} :details} :details, token :token} :body}]
  {token  SetupToken
   engine DBEngine}
  (let [engine           (keyword engine)
        details          (assoc details :engine engine)
        response-invalid (fn [field m] {:status 400 :body (if (= :general field)
                                                            {:message m}
                                                            {:errors {field m}})})]
    (try
      (cond
        (driver/can-connect-with-details? engine details :rethrow-exceptions) {:valid true}
        (and host port (u/host-port-up? host port))                           (response-invalid :dbname  (format "Connection to '%s:%d' successful, but could not connect to DB." host port))
        (and host (u/host-up? host))                                          (response-invalid :port    (format "Connection to '%s' successful, but port %d is invalid." port))
        host                                                                  (response-invalid :host    (format "'%s' is not reachable" host))
        :else                                                                 (response-invalid :general "Unable to connect to database."))
      (catch Throwable e
        (response-invalid :general (.getMessage e))))))


;;; Admin Checklist

(defn- admin-checklist-values []
  (let [has-dbs?           (db/exists? Database, :is_sample false)
        has-dashboards?    (db/exists? 'Dashboard)
        has-pulses?        (db/exists? 'Pulse)
        has-labels?        (db/exists? 'Label)
        has-hidden-tables? (db/exists? 'Table, :visibility_type [:not= nil])
        has-metrics?       (db/exists? 'Metric)
        has-segments?      (db/exists? 'Segment)
        num-tables         (db/select-one-count 'Table)
        num-cards          (db/select-one-count 'Card)
        num-users          (db/select-one-count 'User)]



      [
      {:title       "新增一个数据库"
      :group       "连接数据"
      :description "连接一个数据库，您的团队就可以围绕这些数据展开工作了！"
      :link        "/admin/databases/create"
      :completed   has-dbs?
      :triggered   :always}

     ; {:title       "设置Email服务"
     ;  :group       "连接Email"
     ;  :description "Add email credentials so you can more easily invite team members and get updates via Pulses."
     ;  :link        "/admin/settings/email"
     ;  :completed   (email/email-configured?)
     ;  :triggered   :always}
     ; {:title       "Set Slack credentials"
     ;  :group       "Get connected"
     ;  :description "Does your team use Slack?  If so, you can send automated updates via pulses and ask questions with Metabot."
     ;  :link        "/admin/settings/slack"
     ;  :completed   (slack/slack-configured?)
     ;  :triggered   :always}
     {:title       "邀请团队成员"
      :group       "邀请用户"
      :description "将您的查询分享给您的团队成员。"
      :link        "/admin/people/"
      :completed   (> num-users 1)
      :triggered   (or has-dashboards?
                       has-pulses?
                       (>= num-cards 5))}
     ; {:title       "Hide irrelevant tables"
     ;  :group       "Curate your data"
     ;  :description "If your data contains technical or irrelevant info you can hide it."
     ;  :link        "/admin/datamodel/database"
     ;  :completed   has-hidden-tables?
     ;  :triggered   (>= num-tables 20)}
     ; {:title       "Organize questions"
     ;  :group       "Curate your data"
     ;  :description "Have a lot of saved questions in Metabase? Create labels to help manage them and add context."
     ;  :link        "/questions/all"
     ;  :completed   has-labels?
     ;  :triggered   (>= num-cards 30)}
     ; {:title       "Create metrics"
     ;  :group       "Curate your data"
     ;  :description "Define canonical metrics to make it easier for the rest of your team to get the right answers."
     ;  :link        "/admin/datamodel/database"
     ;  :completed   has-metrics?
     ;  :triggered   (>= num-cards 30)}
     ; {:title       "Create segments"
     ;  :group       "Curate your data"
     ;  :description "Keep everyone on the same page by creating canonnical sets of filters anyone can use while asking questions."
     ;  :link        "/admin/datamodel/database"
     ;  :completed   has-segments?
     ;  :triggered   (>= num-cards 30)}
      ]

    ))

(defn- add-next-step-info
  "Add `is_next_step` key to all the STEPS from `admin-checklist`.
  The next step is the *first* step where `:triggered` is `true` and `:completed` is `false`."
  [steps]
  (loop [acc [], found-next-step? false, [step & more] steps]
    (if-not step
      acc
      (let [is-next-step? (boolean (and (not found-next-step?)
                                        (:triggered step)
                                        (not (:completed step))))
            step          (-> (assoc step :is_next_step is-next-step?)
                              (update :triggered boolean))]
        (recur (conj acc step)
               (or found-next-step? is-next-step?)
               more)))))

(defn- partition-steps-into-groups
  "Partition the admin checklist steps into a sequence of groups."
  [steps]
  (for [[{group-name :group}, :as tasks] (partition-by :group steps)]
    {:name  group-name
     :tasks tasks}))

(defn- admin-checklist []
  (partition-steps-into-groups (add-next-step-info (admin-checklist-values))))

(defendpoint GET "/admin_checklist"
  "Return various \"admin checklist\" steps and whether they've been completed. You must be a superuser to see this!"
  []
  (check-superuser)
  (admin-checklist))


(define-routes)
