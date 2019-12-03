export const queryParams = (params: string) => {
  let strQuery = "?";
  for (let key in params) {
    strQuery += key + "=" + params[key] + "&";
  }

  return strQuery.slice(0, strQuery.length - 1);
};
