
//let ZxyData = require('./zxydata')
let ZxyData = require('./adamdata')

let responseBody = {
  status_code: 200,
  status: "ok",
  msg: "",
  count: 0,
  current_page: 1,
  per_page: 10,
  total_page: 1,
  results: {}
};


let mockData = (function() {
  let keyValue = {};
  for (let key in ZxyData) {
    console.log(key)
    keyValue[key] = {
      ...responseBody,
      results: ZxyData[key]
    };
  }
  return keyValue;
})();

module.exports = () => mockData;
