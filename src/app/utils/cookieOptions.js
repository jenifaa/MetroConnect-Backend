// const isProduction = envVars.NODE_ENV === "production";

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const clearAuthCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};
