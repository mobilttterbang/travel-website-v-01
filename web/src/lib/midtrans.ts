import "server-only";
import midtransClient from "midtrans-client";
import crypto from "node:crypto";

export class MidtransNotConfiguredError extends Error {
  constructor() {
    super(
      "Midtrans isn't configured yet. Add MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY and NEXT_PUBLIC_MIDTRANS_CLIENT_KEY (from https://dashboard.sandbox.midtrans.com) to your environment to enable real payments."
    );
    this.name = "MidtransNotConfiguredError";
  }
}

function isConfigured(): boolean {
  return Boolean(process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY);
}

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export function getSnapClient() {
  if (!isConfigured()) throw new MidtransNotConfiguredError();
  return new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  });
}

export function getCoreApiClient() {
  if (!isConfigured()) throw new MidtransNotConfiguredError();
  return new midtransClient.CoreApi({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  });
}

export function verifyNotificationSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;
  const expected = crypto
    .createHash("sha512")
    .update(payload.order_id + payload.status_code + payload.gross_amount + serverKey)
    .digest("hex");
  return expected === payload.signature_key;
}

