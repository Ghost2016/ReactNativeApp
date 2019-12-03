// console.log(getName())
// console.log(getMobile())
const {sleep} = require('../utils')
describe('登录', () => {

  // // // 起始页面
  it('startScreen', async () => {
    await device.disableSynchronization();
    await waitFor(element(by.text('名企课堂'))).toBeVisible().withTimeout(10000);
    await element(by.text('名企课堂')).swipe('left');
    await waitFor(element(by.text('职业规划'))).toBeVisible().withTimeout(10000);
    await element(by.text('职业规划')).swipe('left');
    await waitFor(element(by.text('能力榜单'))).toBeVisible().withTimeout(10000);
    await expect(element(by.text('能力榜单'))).toBeVisible();
    await element(by.text('注册')).tap();
    await sleep();
    await waitFor(element(by.id('backButton_RegisterScreen'))).toExist().withTimeout(10000);
    await element(by.id('backButton_RegisterScreen')).tap();
    await waitFor(element(by.text('登录'))).toBeVisible().withTimeout(10000);
    await sleep();
    await element(by.text('登录')).tap();
    await waitFor(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible().withTimeout(10000);
  });

  // // // 手机号密码登录
  it('phone_number login', async () => {
    await device.disableSynchronization();
    await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();
    // 输入正确的手机号密码
    await element(by.id('loginPhone_LoginMainScreen')).replaceText('13212345677');
    await element(by.id('password_LoginMainScreen')).replaceText('q1w2e3r4');
    await sleep();
    await element(by.id('loginButton_LoginMainScreen')).tap();
    await expect(element(by.id('locate_CardSchool'))).toBeVisible();

  });
});
