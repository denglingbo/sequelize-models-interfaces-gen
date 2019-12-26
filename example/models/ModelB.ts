import db, { TYPES, IModelDefaultItem } from '../db';

//到货单明细表
export default db.defineModel('ArrivalShippingDetail', {
  test: {
    type: TYPES.STRING(20),
    comment: '到货单号'
  },
  sku: {
    type: TYPES.TINYINT,
    comment: 'SKU'
  },
});