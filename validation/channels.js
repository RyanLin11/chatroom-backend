const yup = require('yup');
const {ObjectIdSchema} = require('../validation/utils');

yup.objectId = () => new ObjectIdSchema();

exports.channelSchema = yup.object().shape({
    name: yup.string().min(1),
    participants: yup.array().of(yup.objectId()),
    admin: yup.objectId(),
});