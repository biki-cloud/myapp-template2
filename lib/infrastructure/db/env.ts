import dotenv from "dotenv";

dotenv.config();

export function getPostgresUrl(): string {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }
  return url;
}

export function getSchema(): string {
  const schema = process.env.SCHEMA_NAME;
  if (!schema) {
    throw new Error("SCHEMA_NAME environment variable is not set");
  }
  return schema;
}

export function getVapidEmail(): string {
  const email = process.env.VAPID_EMAIL;
  if (!email) {
    throw new Error("VAPID_EMAIL environment variable is not set");
  }
  return email;
}

export function getVapidPublicKey(): string {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error(
      "NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable is not set"
    );
  }
  return publicKey;
}

export function getVapidPrivateKey(): string {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("VAPID_PRIVATE_KEY environment variable is not set");
  }
  return privateKey;
}
