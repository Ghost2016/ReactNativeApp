# 职么开门 APP 项目

A simple usage example. If you're using redux, take a look at [example-redux](../example-redux).

## Installation - iOS

- In the `example/` folder, run `npm install`

> Make sure you're using npm ver 3. If you normally use npm ver 2 on your system and reluctant to upgrade, you can install [npm 3 alongside 2](https://www.npmjs.com/package/npm3). For more details see https://github.com/wix/react-native-navigation/issues/1

- Open `example/ios/example.xcodeproj` in Xcode and press the play button

## 如何安装

Xcode 推荐 9 以上版本
Android Studio 推荐 3 以上版本
安装依赖模块：npm install
启动开发服务器: npm run restart
修复安卓 bundle 找不到的问题: npm run androidBuildFix
更多命令请参考：(package.json)[package.json]

## sentry 集成

- 参考[React Native 集成 Sentry 错误日志统计](https://blog.csdn.net/u013718120/article/details/78712487)
- Add Sentry API key and account: file `sentry.properties` change `auth.token`
- Set client key (DSN): file `src/config.js` set `sentryKey` value

## 工作流程

1.  每天早上上班合并最新代码到本地 master
    git pull --rebase upstream master
2.  checkout 新的分支开始工作
    git checkout -b feature-新分支
3.  下班前提交代码（一定要 commit，视情况 push），最好有测试
4.  如果需要合代码，提 PR（Merge Request）
    git commit -m "new: 新的功能"
    PR 在 gitlab 上操作
5.  如果提 PR，找人 review 代码，合并代码到主仓库 master 分支，删除旧分支
    在 gitlab 上操作
6.  在 taiga 上同步完成的任务和发现的问题

## 项目规范

- 提交代码之前需要格式化代码 `npm run format`
- git commit 规范
  new: 新增功能
  chg: 修改功能
  fix: 修复功能
- 版本号 v0.0.0 格式(主版本.大版本.bug 修复)

## 如何发布代码

暂无

## 如何发布 APP

### 简要流程（详细流程参考 docs/ios 发布.doc）

1.  创建 APP 身份证（App ID）
2.  申请 IOS 发布证书（申请完后下载证书到本地）
3.  配置 APP ID(BundleID)
4.  配置测试 Device
5.  申请并配置 IOS 发布描述文件 (申请完后下载描述文件到本地)
6.  安装证书、描述文件
7.  打包 app 生成 ipa 文件
8.  发布 App, 登录到 iTunes Connect 后新建 App 填写对应信息然后提交审核
9.  等待审核通过上架 app store

## 注意事项

- 有交互操作的组件需要预留埋点接口

## 常见问题

> error: 'Lottie/Lottie.h' file not found
> 需要把 Lottir.xcodeproj->products 下的 Lottie.framework 拖拽到 General->Embedded Binaries

> create-react-app 搭建项目报错 Unexpected end of JSON input while parsing near...
> npm 代理为淘宝的代理的时候就会发生这样的错误，将 npm 代理换回来就不报错了
> 需要更新 npm 代理 npm config set registry http://registry.cnpmjs.org

## API 接口交互需要注意的问题(6-7 号和阿光讨论接口问题)

- 版本一致问题，返回接口会保留版本信息
- 基本 API 路径以 /api/sdv[1-9]/ 开始，以免和 zulip 系统冲突
- APP 端没有跨域，接口是否需要考虑安全问题
- JWT token 保存用户相关信息，适合跨终端传递
- API 格式先以 BI 接口为准，以确保一致

## 架构说明文档

[大象 APP 架构文档.md](大象APP架构文档.md)

## 版本发布流程
分支按版本发布的方式:
现在所有分支都合并到对应的版本上，比如feature-v0.2.1上，发小版本
feature-v0.2.1修改完后，才合并到master，发大版本，免udid的。

## 安装 gitchangelog

https://github.com/vaab/gitchangelog

## git 相关

2018-09-04
新的git地址：https://git.shandudata.com/users/sign_in
用户名就是姓名

添加 tag:
git tag -a v1.0.1 f17e13d -m "v1.0.1"
提交 tag
git push -f --tags
删除 tag
git push --delete origin [tag]
git tag -d [tag]
日志带 tag 打印
git log --no-walk --tags --pretty="%h %d %s" --decorate=full


### 适配问题

随着 iPhoneX 的诞生，UI 上也发生了一系列变化。

1.  iOS11 前导航栏的高度是 64，其中状态栏(StatusBar)的高度为 20。iPhoneX 的状态栏(StatusBar)高度变为了 44(传感器区域高度)。

2.  iPhoneX 的底部增加了虚拟 Home 区，由于安全区域的原因默认 TabBar 的高度由 49 变为 83，增高了 34(Home 区高度)，所以自定义的底部 TabBar 也需要需改其适配方案。


### 七牛裁剪
1. http://pbbojsqii.bkt.clouddn.com/IMG_00031530860826562.JPG?imageView2/2/w/300
   https://cdn.zhimekaimen.com/
### Alert
2018-07-07 01:47:27.807014+0800 example[6532:3022056]  | JIGUANG | W - [JIGUANGService] 请将JPush的初始化方法，添加到[UIApplication application: didFinishLaunchingWithOptions:]方法中，否则JPush将不能准确的统计到通知的点击数量。参考文档：https://docs.jiguang.cn/jpush/client/iOS/ios_guide_new/#_6


### 标注网址
https://lanhuapp.com/

### 常用UI参考
https://reactnative.cn/docs/0.40/layout-props.html


### 更多链接
* [keys.md](keys.md)
* [源码修改.md](源码修改.md)
* [错误修复.md](错误修复.md)
* [参考.md](参考.md)

