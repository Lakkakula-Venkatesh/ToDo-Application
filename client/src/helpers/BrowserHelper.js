import Cookies from "js-cookie";

export default function getCookie(name) {
  return Cookies.get(name);
}
export function deleteCookie(name) {
  Cookies.remove(name);
}
export function addCookie(name, value) {
  Cookies.set(name, value)
}
