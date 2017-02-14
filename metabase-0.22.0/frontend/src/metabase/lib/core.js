import { TYPE } from "metabase/lib/types";

export const field_special_types = [{
    'id': TYPE.PK,
    'name': '主键',
    'section': '全局',
    'description': '将当前字段设置为主键。'
}, {
    'id': TYPE.Name,
    'name': '名称',
    'section': '全局',
    'description': '将当前字段设置为查询结果的名称。通常会选择如"名称","标题"这样的字段。'
}, {
    'id': TYPE.FK,
    'name': '外键',
    'section': '全局',
    'description': '关联到另外一张表的某一行。'
}, {
    'id': TYPE.AvatarURL,
    'name': 'Avatar Image URL',
    'section': '通用'
}, {
    'id': TYPE.Category,
    'name': 'Category',
    'section': '通用'
}, {
    'id': TYPE.City,
    'name': 'City',
    'section': '通用'
}, {
    'id': TYPE.Country,
    'name': 'Country',
    'section': '通用'
}, {
    'id': TYPE.Description,
    'name': 'Description',
    'section': '通用'
}, {
    'id': TYPE.Email,
    'name': 'Email',
    'section': '通用'
}, {
    'id': TYPE.ImageURL,
    'name': 'Image URL',
    'section': '通用'
}, {
    'id': TYPE.SerializedJSON,
    'name': 'Field containing JSON',
    'section': '通用'
}, {
    'id': TYPE.Latitude,
    'name': 'Latitude',
    'section': '通用'
}, {
    'id': TYPE.Longitude,
    'name': 'Longitude',
    'section': '通用'
}, {
    'id': TYPE.Number,
    'name': 'Number',
    'section': '通用'
}, {
    'id': TYPE.State,
    'name': 'State',
    'section': '通用'
}, {
    id: TYPE.UNIXTimestampSeconds,
    name: 'UNIX Timestamp (Seconds)',
    'section': '通用'
}, {
    id: TYPE.UNIXTimestampMilliseconds,
    name: 'UNIX Timestamp (Milliseconds)',
    'section': '通用'
}, {
    'id': TYPE.URL,
    'name': 'URL',
    'section': '通用'
}, {
    'id': TYPE.ZipCode,
    'name': 'Zip Code',
    'section': '通用'
}];

export const field_special_types_map = field_special_types
    .reduce((map, type) => Object.assign({}, map, {[type.id]: type}), {});

export const field_visibility_types = [{
    'id': 'normal',
    'name': '全部',
    'description': '默认选项。这些数据将在数据表及查询中可见。'
}, {
    'id': 'details-only',
    'name': '数据详情',
    'description': "只显示在单独查询的详情中。通常此项用户数据冗余且不必显示在图标中时。"
}, {
    'id': 'sensitive',
    'name': '不显示',
    'description': '不再显示此字段内容。通常用于不完整数据或不相关数据的隐藏。'
}];
