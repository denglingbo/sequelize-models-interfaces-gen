import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { existsSync } from 'fs';
import ModelGen, { IModelGenGetData } from './ModelGen';
import InterfaceGen, { IInterfaceGenImportsItem } from './InterfaceGen';
import { getPropTypeByName } from './helpers/model';
import * as ts from 'typescript';

const MODEL_KEY: string = 'defineModel';
const expr = /_(\w{1})/g;

interface IConfigImportsItem extends IInterfaceGenImportsItem {
  path: string;
}

type IConfigFiles = {
  filePath: string;
  extendsConfig?: string[],
  importsConfig?: IConfigImportsItem[];
};

interface IConfig {
  files: IConfigFiles[];
  output: string;
  importsConfig?: any[];
}

/**
 * 如果源文件中没有 model 变量，则判断是否在 export default | exports.default 的 args[1] 中
 *
 * args:
 *  1.
 *    export default db.defineModel('xxxxx', { ... })
 *    ExportDefaultDeclaration -> n.declaration.arguments
 *  2.
 *    exports.default = db_1.default.defineModel('xxx', { ... })
 *    ExpressionStatement -> n.expression.right.arguments
 */
function getDefineModelData(args: any): IModelGenGetData {
  const data: IModelGenGetData = {
    interfaceName: null,
    props: [],
    source: {
      tablename: ''
    }
  };

  const nameFinder = args.find((a: any) => a.type === 'Literal');

  if (!nameFinder) {
    return data;
  }

  data.source.tablename = nameFinder.value;

  const name = nameFinder.value.replace(expr, (a: string, b: string) =>
    b.toUpperCase()
  );

  data.interfaceName = `${name}Data`;

  const valueFinder = args.find((a: any) => a.type === 'ObjectExpression');
  if (valueFinder) {
    valueFinder.properties.forEach((v: any) => {
      const { key, value } = v;

      data.props.push({
        name: key.name,
        type: getPropTypeByName(value.properties, 'type')
      });
    });
  }

  return data;
}

/**
 * 创建声明文件
 * @param ast
 */
function createInterfaces(ast: any): IModelGenGetData | null {
  const mg = new ModelGen();
  // 判断文件中是否有 const model = xxxxx
  let hasModelVariable = false;

  walk.ancestor(ast, {
    /**
     * 从 ExpressionStatement export.default 上获取 Interface 名以及数据
     * @param _
     * @param ancestors
     */
    ExpressionStatement(_: any, ancestors: any) {
      ancestors.forEach((n: any) => {
        const { expression } = n;
        if (
          (n.type =
            'ExpressionStatement' &&
            expression &&
            expression.left &&
            expression.right) &&
          n.type.callee
        ) {
          if (n.type.callee.property.name === MODEL_KEY) {
            const { interfaceName, props, source } = getDefineModelData(
              expression.right.arguments
            );
            if (interfaceName) {
              mg.addInterface(interfaceName);
            }

            if (source) {
              mg.addSource(source);
            }

            if (!hasModelVariable) {
              mg.addProperties(props);
            }
          }
        }
      });
    },

    /**
     * 从 const let var 变量上获取 跟 MODEL_KEY 匹配的数据
     * @param _
     * @param ancestors
     */
    VariableDeclarator(_: any, ancestors: any) {
      ancestors.forEach((n: any) => {
        if (
          n.type === 'VariableDeclarator' &&
          n.init &&
          n.init.callee.property &&
          n.init.callee.property.name === MODEL_KEY
        ) {
          hasModelVariable = true;

          const { interfaceName, props } = getDefineModelData(n.init.arguments);

          if (interfaceName) {
            mg.addInterface(interfaceName);
          }

          mg.addProperties(props);
        }
      });
    }
  });

  return mg.getData();
}

export default async function(config: IConfig) {
  const gen = new InterfaceGen(config.output);
  const res = { success: 0, failed: 0 };

  for (const file of config.files) {
    if (!existsSync(file.filePath)) {
      throw new Error(`Not found the file: ${file.filePath}`);
    }

    const source = ts.sys.readFile(file.filePath);

    if (source) {
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS }
      });

      const ast: any = acorn.parse(outputText, { sourceType: 'module' });
      const item: IModelGenGetData | null = createInterfaces(ast);

      if (item !== null && item.interfaceName) {
        const { source = {} } = item;

        gen.addProps(item.interfaceName, item.props);

        // 给单个文件添加导入配置
        if (file.importsConfig) {
          file.importsConfig.forEach((importConfig: IConfigImportsItem) => {
            const { path, ...rest } = importConfig;
            gen.addImport(path, rest);
          });
        }

        if (source) {
          gen.addDoc(`Auto gererated by sequelize-models-interfaces-gen
db table name: ${source.tablename}`);
        }

        if (file.extendsConfig) {
          gen.addExtends(file.extendsConfig);
        }

        res.success ++;
      } else {
        res.failed ++;
        console.error(`[ERROR]: ${file.filePath}`);
      }
    }
  }

  /**
   * 添加公共的 imports
   */
  if (config.importsConfig) {
    config.importsConfig.forEach((importConfig: IConfigImportsItem) => {
      const { path, ...rest } = importConfig;
      gen.addImport(path, rest);
    });
  }

  // console.log('interfaces-gen:\n', gen.getText());
  await gen.createFileSync();

  console.log(`
<========================= START =========================>
Auto gererated Success by sequelize-models-interfaces-gen.
Total: ${config.files.length}
Success: ${res.success}
Failed: ${res.failed}
<=========================  END  =========================>
  `
  );
}
