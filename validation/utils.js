const { ObjectId } = require('bson');
const yup = require('yup');

class ObjectIdSchema extends yup.mixed {
  constructor() {
    super({ type: 'objectId' });

    this.withMutation(schema => {
      schema.transform(function(value) {
        if (this.isType(value)) return value;
        return new ObjectId(value);
      });
    });
  }
  
  _typeCheck(value) {
    return ObjectId.isValid(value);
  }
}

module.exports.ObjectIdSchema = ObjectIdSchema;