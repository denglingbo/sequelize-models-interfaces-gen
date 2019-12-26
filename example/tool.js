const interfacesGen = require('../dist').default;
const path = require('path');

const resolveModelPath = (name) => path.resolve(__dirname, `./models/${name}.ts`);

interfacesGen({
  output: path.resolve(__dirname, `./types/models.ts`),
  importsConfig: [{
    defaultImport: 'db',
    namedImports: ['IModelDefaultItem'],
    path: '../db',
  }],
  files: [
    {
      filePath: resolveModelPath('ModelA'),
      importsConfig: [{
        namedImports: ['IRequelizeItem'],
        path: '../db',
      }],
      extendsConfig: ['IModelDefaultItem', 'IRequelizeItem'],
    },
    {
      filePath: resolveModelPath('ModelB'),
    },
  ]
});