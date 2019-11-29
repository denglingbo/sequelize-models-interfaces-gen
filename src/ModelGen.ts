import { upperFirst } from 'lodash';

export interface IModelGenProperty {
  name: string;
  type: any;
}

export interface IModelGenGetData {
  interfaceName: string | null;
  props: IModelGenProperty[];
  source: any;
}

export default class ModelGen {
  private interfaceName: string | null = null;
  private props: IModelGenProperty[] = [];
  private source: any = {};

  public addInterface(name: string) {
    this.interfaceName = `I${upperFirst(name)}`;
  }

  public addProperty(data: IModelGenProperty) {
    this.props.push(data);
  }

  public addProperties(data: IModelGenProperty[]) {
    this.props = data;
  }

  // 添加源文件的信息
  public addSource(source: any) {
    this.source = source;
  }

  public getData(): IModelGenGetData | null {
    if (!this.interfaceName || this.props.length === 0) {
      return null;
    }

    return {
      interfaceName: this.interfaceName,
      props: this.props,
      source: this.source || {}
    }
  }
}
