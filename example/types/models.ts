import { IRequelizeItem } from "../db";
import db, { IModelDefaultItem } from "../db";

/**
 * Auto gererated by sequelize-models-interfaces-gen
 * db table name: ArrivalShippingDetail
 */
export interface IArrivalShippingDetailData extends IModelDefaultItem, IRequelizeItem {
    arrival_no: string;
    sku_no: string;
    expected_arrival_qty: number;
    actual_arrival_qty: number;
    good_qty: number;
    damaged_qty: number;
}

/**
 * Auto gererated by sequelize-models-interfaces-gen
 * db table name: ArrivalShippingDetail
 */
export interface IArrivalShippingDetailData {
    test: string;
    sku: number;
}
