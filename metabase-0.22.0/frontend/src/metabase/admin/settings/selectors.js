import _ from "underscore";
import { createSelector } from "reselect";
import MetabaseSettings from "metabase/lib/settings";

import { slugify } from "metabase/lib/formatting";

import CustomGeoJSONWidget from "./components/widgets/CustomGeoJSONWidget.jsx";

const SECTIONS = [
    {
        name: "初始设置",
        settings: []
    },
    {
        name: "站点设置",
        settings: [
            {
                key: "site-name",
                display_name: "站点名称",
                type: "string"
            },
            {
                key: "-site-url",
                display_name: "站点 URL",
                type: "string"
            }
        ]
    },
    {
        name: "Email设置",
        settings: [
            {
                key: "email-smtp-host",
                display_name: "SMTP 服务器",
                placeholder: "smtp.yourservice.com",
                type: "string",
                required: true,
                autoFocus: true
            },
            {
                key: "email-smtp-port",
                display_name: "SMTP 端口",
                placeholder: "587",
                type: "string",
                required: true,
                validations: [["integer", "That's not a valid port number"]]
            },
            {
                key: "email-smtp-security",
                display_name: "SMTP 模式",
                description: null,
                type: "radio",
                options: { none: "None", ssl: "SSL", tls: "TLS" },
                defaultValue: 'none'
            },
            {
                key: "email-smtp-username",
                display_name: "SMTP 用户名",
                description: null,
                placeholder: "youlooknicetoday",
                type: "string"
            },
            {
                key: "email-smtp-password",
                display_name: "SMTP 密码",
                description: null,
                placeholder: "Shh...",
                type: "password"
            },
            {
                key: "email-from-address",
                display_name: "发件邮箱地址",
                placeholder: "dataUltra@yourcompany.com",
                type: "string",
                required: true,
                validations: [["email", "这不是一个有效的Email地址"]]
            }
        ]
    }
    
];
for (const section of SECTIONS) {
    section.slug = slugify(section.name);
}

export const getSettings = state => state.settings.settings;

export const getNewVersionAvailable = createSelector(
    getSettings,
    (settings) => {
        return MetabaseSettings.newVersionAvailable(settings);
    }
);

export const getSections = createSelector(
    getSettings,
    (settings) => {
        if (!settings || _.isEmpty(settings)) {
            return [];
        }

        let settingsByKey = _.groupBy(settings, 'key');
        return SECTIONS.map(function(section) {
            let sectionSettings = section.settings.map(function(setting) {
                const apiSetting = settingsByKey[setting.key][0];
                if (apiSetting) {
                    return {
                        placeholder: apiSetting.default,
                        ...apiSetting,
                        ...setting
                    };
                }
            });
            return {
                ...section,
                settings: sectionSettings
            };
        });
    }
);

export const getActiveSectionName = (state, props) => props.params.section

export const getActiveSection = createSelector(
    getActiveSectionName,
    getSections,
    (section = "初始设置", sections) => {
        if (sections) {
            return _.findWhere(sections, { slug: section });
        } else {
            return null;
        }
    }
);
