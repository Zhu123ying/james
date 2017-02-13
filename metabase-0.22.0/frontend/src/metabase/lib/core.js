import { TYPE } from "metabase/lib/types";

export const field_special_types = [{
    'id': TYPE.PK,
    'name': 'Entity Key',
    'section': 'Overall Row',
    'description': 'The primary key for this table.'
}, {
    'id': TYPE.Name,
    'name': 'Entity Name',
    'section': 'Overall Row',
    'description': 'The "name" of each record. Usually a column called "name", "title", etc.'
}, {
    'id': TYPE.FK,
    'name': 'Foreign Key',
    'section': 'Overall Row',
    'description': 'Points to another table to make a connection.'
}, {
    'id': TYPE.AvatarURL,
    'name': 'Avatar Image URL',
    'section': 'Common'
}, {
    'id': TYPE.Category,
    'name': 'Category',
    'section': 'Common'
}, {
    'id': TYPE.City,
    'name': 'City',
    'section': 'Common'
}, {
    'id': TYPE.Country,
    'name': 'Country',
    'section': 'Common'
}, {
    'id': TYPE.Description,
    'name': 'Description',
    'section': 'Common'
}, {
    'id': TYPE.Email,
    'name': 'Email',
    'section': 'Common'
}, {
    'id': TYPE.ImageURL,
    'name': 'Image URL',
    'section': 'Common'
}, {
    'id': TYPE.SerializedJSON,
    'name': 'Field containing JSON',
    'section': 'Common'
}, {
    'id': TYPE.Latitude,
    'name': 'Latitude',
    'section': 'Common'
}, {
    'id': TYPE.Longitude,
    'name': 'Longitude',
    'section': 'Common'
}, {
    'id': TYPE.Number,
    'name': 'Number',
    'section': 'Common'
}, {
    'id': TYPE.State,
    'name': 'State',
    'section': 'Common'
}, {
    id: TYPE.UNIXTimestampSeconds,
    name: 'UNIX Timestamp (Seconds)',
    'section': 'Common'
}, {
    id: TYPE.UNIXTimestampMilliseconds,
    name: 'UNIX Timestamp (Milliseconds)',
    'section': 'Common'
}, {
    'id': TYPE.URL,
    'name': 'URL',
    'section': 'Common'
}, {
    'id': TYPE.ZipCode,
    'name': 'Zip Code',
    'section': 'Common'
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
    'name': 'Do Not Include',
    'description': 'Metabase will never retrieve this field. Use this for sensitive or irrelevant information.'
}];
