/* @flow */

// 获取字符长度，中文为2--全角，英文为1--半角
export const getStringLength = function(str) {
  //要获得长度的字符串
  let realLength = 0, len = str.length, charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) 
      realLength += 1;
    else
      realLength += 2;
  }
  return realLength;
};

/**
 * 截取字符指字长度的字符
 * 中文为2--全角，英文为1--半角
 * @param {String} str 
 * @param {Number} length 
 */
export const sliceStringLength = function(str, length) {
  // 剩余需要截取的长度
  let lengthLeft = length;
  let len = str.length;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) 
      lengthLeft -= 1
    else 
      lengthLeft -= 2
    // 遍历到截取长度
    if(lengthLeft < 0) return str.slice(0,i)
  }
   return str
}
