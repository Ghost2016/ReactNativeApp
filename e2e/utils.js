const sleep = function(){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

module.exports = {
  sleep: sleep
}

