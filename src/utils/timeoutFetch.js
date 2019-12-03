
/**
 * 带了超时的fetch
 */
const _fetch = (function(fetch){
  return function(url,options){
    const defaultTimeout = 12000;
    let abort = null;

    const abort_promise = new Promise((resolve, reject)=>{
      abort = () => {
        reject(new Error('timeout'));
      };
    });
    // 通过promise.race抛弃跑得慢的
    const promise = Promise.race([
      fetch(url, options),
      abort_promise
    ]);

    promise.abort = abort;
    setTimeout(abort, options.timeout || defaultTimeout);
    return promise;
  };
})(fetch);
export default _fetch


