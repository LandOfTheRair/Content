
const recurse = require('recursive-readdir');
const fs = require('fs');

const validate = async () => {
  console.log('Validating Maps...');

  const files = await recurse(`maps`);
  
  files.forEach(map => {
    const json = JSON.parse(fs.readFileSync(map));

    if(json.version > 1.1) {
      throw new Error(`Map ${map} version is > 1.1! This is invalid because json2 parsing is not functional for this game.`);
    }
  })

};

validate();