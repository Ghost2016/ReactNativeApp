require('babel-polyfill');
const detox = require('detox');
const config = require('../package.json').detox;

before(async () => {
  await detox.init(config);
  await device.launchApp({
    // permissions: {
    //     notifications: "YES",
    //     health: "YES",
    //     location: 'always'
    // },
  });
});

// after(async () => {
//   await detox.cleanup();
// });