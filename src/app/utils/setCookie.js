import {
  accessTokenCookieOptions,
  clearAuthCookieOptions,
  refreshTokenCookieOptions,
} from "./cookieOptions.js";

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", clearAuthCookieOptions);
  res.clearCookie("refreshToken", clearAuthCookieOptions);
};

export const setAuthCookie = (res, tokenInfo) => {
  clearAuthCookies(res);

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, accessTokenCookieOptions);
  }

  if (tokenInfo.refreshToken) {
    res.cookie(
      "refreshToken",
      tokenInfo.refreshToken,
      refreshTokenCookieOptions,
    );
  }
};
