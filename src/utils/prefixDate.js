export const prefiexDate = (params: number) => {
  if (params < 10) {
    return "0" + params;
  }
  return params;
};
