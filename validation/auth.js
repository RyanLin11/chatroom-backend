const yup = require('yup');

exports.loginSchema = yup.object().shape({
    body: yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
    })
});