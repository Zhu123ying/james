(ns metabase.test.data.oracle
  (:require [clojure.java.jdbc :as jdbc]
            [clojure.string :as s]
            [environ.core :refer [env]]
            [metabase.driver.generic-sql :as sql]
            [metabase.test.data :as data]
            (metabase.test.data [datasets :as datasets]
                                [generic-sql :as generic]
                                [interface :as i])
            [metabase.util :as u])
  (:import metabase.driver.oracle.OracleDriver))

(defn- get-db-env-var
  " Look up the relevant connection param from corresponding env var or throw an exception if it's not set.

     (get-db-env-var :user) ; Look up `MB_ORACLE_USER`"
  [env-var & [default]]
  (or (env (keyword (format "mb-oracle-%s" (name env-var))))
      default
      (throw (Exception. (format "In order to test Oracle, you must specify the env var MB_ORACLE_%s."
                                 (s/upper-case (name env-var)))))))

;; Similar to SQL Server, Oracle on AWS doesn't let you create different databases;
;; We'll create a unique schema (the same as a "User" in Oracle-land) for each test run and use that to keep
;; tests from clobbering over one another; we'll also qualify the names of tables to include their DB name
;;
;; e.g.
;; H2 Tests                   | Oracle Tests
;; ---------------------------+------------------------------------------------
;; PUBLIC.VENUES.ID           | CAM_195.test_data_venues.id
;; PUBLIC.CHECKINS.USER_ID    | CAM_195.test_data_checkins.user_id
;; PUBLIC.INCIDENTS.TIMESTAMP | CAM_195.sad_toucan_incidents.timestamp
(defonce ^:private ^:const session-schema-number (rand-int 200))
(defonce ^:private ^:const session-schema        (str "CAM_" session-schema-number))
(defonce ^:private ^:const session-password      (apply str (repeatedly 16 #(rand-nth (map char (range (int \a) (inc (int \z))))))))


(def ^:private db-connection-details
  (delay {:host     (get-db-env-var :host)
          :port     (Integer/parseInt (get-db-env-var :port "1521"))
          :user     (get-db-env-var :user)
          :password (get-db-env-var :password)
          :sid      (get-db-env-var :sid)}))


(def ^:private ^:const field-base-type->sql-type
  {:type/BigInteger "NUMBER(*,0)"
   :type/Boolean    "NUMBER(1)"
   :type/Date       "DATE"
   :type/DateTime   "TIMESTAMP"
   :type/Decimal    "DECIMAL"
   :type/Float      "BINARY_FLOAT"
   :type/Integer    "INTEGER"
   :type/Text       "VARCHAR2(4000)"}) ; Oracle doesn't have a TEXT type so use the maximum size for a VARCHAR2

(defn- drop-table-if-exists-sql [{:keys [database-name]} {:keys [table-name]}]
  (format "BEGIN
             EXECUTE IMMEDIATE 'DROP TABLE \"%s\".\"%s\" CASCADE CONSTRAINTS'???
           EXCEPTION
             WHEN OTHERS THEN
               IF SQLCODE != -942 THEN
                 RAISE???
               END IF???
           END???"
          session-schema
          (i/db-qualified-table-name database-name table-name)))

(defn- expected-base-type->actual [base-type]
  ;; Oracle doesn't have INTEGERs
  (if (isa? base-type :type/Integer)
    :type/Decimal
    base-type))


(extend OracleDriver
  generic/IGenericSQLDatasetLoader
  (merge generic/DefaultsMixin
         {:create-db-sql             (constantly nil)
          :drop-db-if-exists-sql     (constantly nil)
          :drop-table-if-exists-sql  (u/drop-first-arg drop-table-if-exists-sql)
          :execute-sql!              generic/sequentially-execute-sql!
          :field-base-type->sql-type (u/drop-first-arg field-base-type->sql-type)
          :load-data!                generic/load-data-one-at-a-time-parallel!
          :pk-sql-type               (constantly "INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1 INCREMENT BY 1) NOT NULL") ; LOL
          :qualified-name-components (partial i/single-db-qualified-name-components session-schema)})

  i/IDatasetLoader
  (merge generic/IDatasetLoaderMixin
         {:database->connection-details (fn [& _] @db-connection-details)
          :default-schema               (constantly session-schema)
          :engine                       (constantly :oracle)
          :expected-base-type->actual   (u/drop-first-arg expected-base-type->actual)
          :id-field-type                (constantly :type/Decimal)}))

(defn- dbspec [& _]
  (sql/connection-details->spec (OracleDriver.) @db-connection-details))

(defn- non-session-schemas
  "Return a set of the names of schemas (users) that are not meant for use in this test session (i.e., ones that should be ignored).
   (This is used as part of the implementation of `excluded-schemas` for the Oracle driver during tests.)"
  []
  (set (map :username (jdbc/query (dbspec) ["SELECT username FROM dba_users WHERE username <> ?" session-schema]))))


;;; Clear out the sesion schema before and after tests run
;; TL;DR Oracle schema == Oracle user. Create new user for session-schema
(def ^:private execute-when-testing-oracle!
  (partial generic/execute-when-testing! :oracle dbspec))

(defn- create-session-user!
  {:expectations-options :before-run}
  []
  (u/ignore-exceptions
    (execute-when-testing-oracle! (format "DROP USER %s CASCADE" session-schema)))
  (execute-when-testing-oracle! (format "CREATE USER %s IDENTIFIED BY %s DEFAULT TABLESPACE USERS QUOTA UNLIMITED ON USERS" session-schema session-password)))

(defn- destroy-session-user!
  {:expectations-options :after-run}
  []
  (execute-when-testing-oracle! (format "DROP USER %s CASCADE" session-schema)))
