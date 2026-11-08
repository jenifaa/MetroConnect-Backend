import crypto from "crypto";

export const generateAnonymousToken = (userId) => {
  return crypto
    .createHmac("sha256", process.env.ANONYMOUS_HMAC_SECRET)
    .update(String(userId))
    .digest("hex");
};
