const yup = require('yup');
const {ObjectIdSchema} = require('../validation/utils');

yup.objectId = () => new ObjectIdSchema();

exports.messageSchema = yup.object().shape({
    body: yup.object().shape({
        channel: yup.objectId().required(),
        text: yup.string().required(),
    })
});

exports.updateMessageSchema = yup.object().shape({
    body : yup.object().shape({
        channel: yup.string().strip(),
        sender: yup.string().strip(),
        text: yup.string().required(),
    })
});