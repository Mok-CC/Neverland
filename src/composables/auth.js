import { useCookies } from "@vueuse/integrations/useCookies";

const TokenKey = "admin-token";

const cookie = useCookies();

// 获取token
export function getToken() {
  return cookie.get(TokenKey);
}

// 清除token
export function removeToken() {
  return cookie.remove(TokenKey);
}

// 设置token
export function setToken(token) {
  return cookie.set(TokenKey, token);
}
