import {
  Project,
  SourceFile,
  InterfaceDeclaration,
  ImportDeclaration
} from 'ts-morph';
import { existsSync, unlinkSync } from 'fs';
import { IModelGenProperty } from './ModelGen';

export interface IInterfaceGenImportsItem {
  defaultImport?: string;
  namedImports?: string[];
}

export default class {
  private project: Project;
  private sourceFile: SourceFile;
  private interfaceDeclaration: InterfaceDeclaration;

  constructor(path: string) {
    if (existsSync(path)) {
      unlinkSync(path);
    }

    this.project = new Project();
    this.sourceFile = this.project.createSourceFile(path);
  }

  public addProps(interfaceName: string, props: IModelGenProperty[]) {
    this.interfaceDeclaration = this.sourceFile.addInterface({
      name: interfaceName,
      isExported: true
    });

    this.interfaceDeclaration.addProperties(props);

    return this;
  }

  public addDoc(text: string) {
    this.interfaceDeclaration.addJsDoc({
      description: text
    });
  }

  public addExtends(list: string[]) {
    this.interfaceDeclaration.addExtends(list);
  }

  /**
   * 创建 import 信息
   * @param path
   * @param importConfig
   */
  public addImport(path: string, importConfig: IInterfaceGenImportsItem) {
    const importDeclaration: ImportDeclaration = this.sourceFile.addImportDeclaration(
      {
        ...(importConfig.defaultImport
          ? {
              defaultImport: importConfig.defaultImport
            }
          : {}),
        moduleSpecifier: path
      }
    );

    if (importConfig.namedImports) {
      importDeclaration.addNamedImports(importConfig.namedImports);
    }
  }

  public getText() {
    return this.sourceFile.getText();
  }

  public createFileSync() {
    this.sourceFile.saveSync();
  }
}
