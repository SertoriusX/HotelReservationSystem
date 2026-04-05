export interface HotelModelUpdate {
  name: string;
  description: string;
  cityId?: number;
  allowPayNow?: boolean;
  allowSaveCard?: boolean;
  saveCardFeePercent?: number;
  autoPayDaysBefore?: number;
}
