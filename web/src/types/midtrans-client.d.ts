declare module "midtrans-client" {
  export type MidtransClientOptions = {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  };

  export type SnapTransactionParams = {
    transaction_details: { order_id: string; gross_amount: number };
    credit_card?: { secure?: boolean };
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    item_details?: Array<{ id: string; price: number; quantity: number; name: string }>;
    enabled_payments?: string[];
  };

  export type SnapTransactionResult = {
    token: string;
    redirect_url: string;
  };

  export class Snap {
    constructor(options: MidtransClientOptions);
    createTransaction(params: SnapTransactionParams): Promise<SnapTransactionResult>;
  }

  export type CoreApiChargeParams = {
    payment_type: string;
    transaction_details: { order_id: string; gross_amount: number };
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    bank_transfer?: { bank: string };
    echannel?: { bill_info1?: string; bill_info2?: string };
  };

  export type CoreApiChargeResult = {
    status_code: string;
    transaction_id: string;
    order_id: string;
    va_numbers?: Array<{ bank: string; va_number: string }>;
    permata_va_number?: string;
    bill_key?: string;
    biller_code?: string;
    expiry_time?: string;
  };

  export class CoreApi {
    constructor(options: MidtransClientOptions);
    charge(params: CoreApiChargeParams): Promise<CoreApiChargeResult>;
  }

  const midtransClient: { Snap: typeof Snap; CoreApi: typeof CoreApi };
  export default midtransClient;
}
