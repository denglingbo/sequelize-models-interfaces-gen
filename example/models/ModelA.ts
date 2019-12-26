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