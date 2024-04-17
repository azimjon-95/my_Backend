const check = require('../validation/ajv.controls')

class userValidations {
    async add(req, res, next) {
        const schema = {
            type: "object",
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                address: { type: 'string' },
                phone: { type: 'number' },
                birthday: { type: 'string' }
            },
            required: ["username", "password", "firstname", "lastname", "birthday"]
        }
        const result = await check(schema, req.body)
        if (!result) return next();
        await res.json(result);
    }
}
module.exports = new userValidations();