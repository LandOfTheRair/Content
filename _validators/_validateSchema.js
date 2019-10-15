
const { get, isUndefined, difference } = require('lodash');

// schema:
/*
array
[ prop, isRequired, validator ]
*/

module.exports.validateSchema = (label, obj, schema) => {
  schema.forEach(([prop, required, validator]) => {
    const value = get(obj, prop);

    if(isUndefined(value)) {
      if(required) throw new Error(`Property '${prop}' is required, but absent in '${label}'.`);
      return;
    }

    if(!validator(value)) throw new Error(`Property '${prop}' does not pass validation for '${label}'.`);

    const basePropsSchema = schema.filter(x => !x[0].includes('.')).map(x => x[0]);
    const baseObjProps = Object.keys(obj);

    const diff = difference(baseObjProps, basePropsSchema);
    if(diff.length > 0) {
      throw new Error(`Properties ${diff.join(',')} are in '${label}' but not in schema.`);
    }
  });
};