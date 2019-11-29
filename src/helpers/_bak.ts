

// function createFromOneModel(code: string): IModelGenGetData | null {
//   // console.log('code: ', code);
//   let ast = null;
//   try {
//     ast = acorn.parse(code, { sourceType: 'module' });
//   } catch (ex) {
//     console.log(ex);
//     return null;
//   }

//   const gen = new ModelGen();
//   // 判断文件中是否有 const model = xxxxx
//   let hasModelVariable = false;

//   walk.ancestor(ast, {
//     ExportDefaultDeclaration(_: any, ancestors: any) {
//       ancestors.forEach((n: any) => {
//         if (
//           n.type === 'ExportDefaultDeclaration' &&
//           n.declaration.type === 'CallExpression' &&
//           n.declaration.callee.property.name === 'defineModel'
//         ) {
//           const args = n.declaration.arguments;
//           const nameFinder = args.find((a: any) => a.type === 'Literal');
//           const name = nameFinder.value.replace(expr, (a: string, b: string) =>
//             b.toUpperCase()
//           );

//           gen.addInterface(`${name}Data`);

//           /**
//            * 如果源文件中没有 model 变量，则判断是否在 export default 的 {} 中
//            *
//            * export default db.defineModel('xxxxx', { ... })
//            */
//           const valueFinder = args.find(
//             (a: any) => a.type === 'ObjectExpression'
//           );
//           if (!hasModelVariable && valueFinder) {
//             valueFinder.properties.forEach((v: any) => {
//               const { key, value } = v;

//               gen.addProperty({
//                 name: key.name,
//                 type: getPropTypeByName(value.properties, 'type')
//               });
//             });
//           }
//         }
//       });
//     },

//     VariableDeclarator(_: any, ancestors: any) {
//       ancestors.forEach((n: any) => {
//         if (n.type === 'VariableDeclarator' && n.id.name === MATCH_KEY) {
//           hasModelVariable = true;

//           n.init.properties.map((prop: any) => {
//             const { key, value } = prop;

//             gen.addProperty({
//               name: key.name,
//               type: getPropTypeByName(value.properties, 'type')
//             });
//           });
//         }
//       });
//     }
//   });

//   return gen.getData();
// }