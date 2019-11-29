### 使用文档

#### 描述
该插件用于给 sequelize 的 model 自动生成 model 的 interface 文件

#### tools/index.js
```
$ node tools/index.js
or
加入构建过程
```
#### 示例代码
```
const interfacesGen = require('sequelize-models-interfaces-gen').default;
const path = require('path');

const resolveModelPath = (name) => path.resolve(__dirname, `../src/models/${name}.ts`);

interfacesGen({
  output: path.resolve(__dirname, `../src/types/models.ts`),
  importsConfig: [{
    defaultImport: 'db',
    namedImports: ['IModelDefaultItem'],
    path: '../db',
  }],
  files: [
    {
      filePath: resolveModelPath('ArrivalShippingCartonNo'),
      importsConfig: [{
        namedImports: ['IRequelizeItem'],
        path: '../db',
      }],
      extendsConfig: ['IModelDefaultItem', 'IRequelizeItem'],
    },
    {
      filePath: resolveModelPath('ArrivalShippingDetail'),
    },
  ]
});
```

#### Model <path/src/models/*>

##### files
```
  ArrivalShippingCartonNo: path/src/models/ArrivalShippingCartonNo.ts
  ArrivalShippingDetail: path/src/models/ArrivalShippingDetail.ts
```

##### ArrivalShippingCartonNo.ts
```
// PATH: path/src/models/ArrivalShippingCartonNo.ts
import db, { TYPES, IModelDefaultItem } from '../db';

//到货单快递信息表
export default db.defineModel('arrival_shipping_carton_no', {
  arrival_no: {
    type: TYPES.STRING(100),
    comment: '到货单号',
  },
  carton_no: {
    type: TYPES.BIGINT,
    comment: '箱号',
  },
});
```

##### ArrivalShippingDetail.ts
```
// PATH: path/src/models/ArrivalShippingDetail.ts
import db, { TYPES, IModelDefaultItem } from '../db';

//到货单明细表
export default db.defineModel('ArrivalShippingDetail', {
  arrival_no: {
    type: TYPES.STRING(100),
    comment: '到货单号'
  },
  sku_no: {
    type: TYPES.STRING(30),
    comment: 'SKU_NO'
  },
  expected_arrival_qty: {
    type: TYPES.INTEGER,
    comment: '预计收货数量'
  },
  actual_arrival_qty: {
    type: TYPES.INTEGER,
    allowNull: true,
    comment: '实际收货数量'
  },
  good_qty: {
    type: TYPES.INTEGER,
    allowNull: true,
    comment: '实收正品数量'
  },
  damaged_qty: {
    type: TYPES.INTEGER,
    allowNull: true,
    comment: '实收残品数量'
  }
});
```


#### Output <path/types/modeles.ts>
```
import { IRequelizeItem } from "../db";
import db, { IModelDefaultItem } from "../db";

/**
 * Auto gererated by sequelize-models-interfaces-gen
 * db table name: arrival_shipping_carton_no
 */
export interface IArrivalShippingCartonNoData extends IModelDefaultItem, IRequelizeItem {
    arrival_no: string;
    carton_no: number;
}

/**
 * Auto gererated by sequelize-models-interfaces-gen
 * db table name: arrival_shipping_detail
 */
export interface IArrivalShippingDetailData {
    arrival_no: string;
    sku_no: string;
    expected_arrival_qty: number;
    actual_arrival_qty: number;
    good_qty: number;
    damaged_qty: number;
}
```

