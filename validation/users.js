const yup = require('yup');
const {ObjectIdSchema} = require('../validation/utils');
yup.objectId = () => new ObjectIdSchema();

exports.userSchema = yup.object().shape({
    body: yup.object({
        username: yup.string().required(),
        password: yup.string().min(5).required(),
        display_name: yup.string().min(1),
        image: yup.string().url(),
        channels: yup.array().of(yup.objectId()),
    })
});

exports.updateUserSchema = yup.object().shape({
    body: yup.object().shape({
        username: yup.string().strip(),
        password: yup.string().min(5).required(),
        display_name: yup.string().min(1),
        image: yup.string().url(),
        channel: yup.array().of(yup.objectId())
    })
});