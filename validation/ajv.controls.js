const AJV = require('ajv');

const ajv = new AJV();

class check {
    async check(schema, data) {
        const result = ajv.validate(schema, data);
        if (result) return null;
        return ajv.errorsText();
    }
}

module.exports = new check()