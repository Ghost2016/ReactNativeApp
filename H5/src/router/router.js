import React, { Component, PropTypes } from "react";
import {
  Router,
  Route,
  Redirect,
  IndexRoute,
  browserHistory,
  hashHistory
} from "react-router";
import { action } from "../redux/action/index.js";

// 默认导入首页
import Home from "../page/home";
import Track from "../page/track";
import Data from "../page/data";
import ImgPrev from "../page/imgPrev";
import Salary from "../page/salary";
import Post from "../page/post";
import Post2 from "../page/post2";
import Register from "../page/register";
import Predict from "../page/predict";
import PredictApp from "../page/predictApp";
import DownloadApp from "../page/downloadApp";
import AppLink from "../page/appLink";
import Video from "../page/video";

class Roots extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

// 路由验证
// 可以在这一层做一步验证url权限
const AuthCheck = store => {
  return (nextState, replace) => {

    // var state = store.getState();

  };
};

// console.log(Router, Route, Redirect, IndexRoute, browserHistory, hashHistory)
// 浏览器历史这里统一使用hashHistory 不使用browserHistory
export default store => {
  return (
    <Route>
      {/* <Route path="/(:filter)" component={Roots} >    // 去掉中间的#符号 */}
      <Route path="/" component={Roots} onEnter={AuthCheck(store)}>
        <IndexRoute component={Home} />
        <Route path="/index" component={Home} />
        <Route path="/data" component={Data} />
        <Route path="/imgprev" component={ImgPrev} />
        <Route path="/salary" component={Salary} />
        <Route path="/track" component={Track} />
        <Route path="/post" component={Post} />
        <Route path="/post2" component={Post2} />
        <Route path="/register" component={Register} />
        <Route path="/predictSalary" component={Predict} />
        <Route path="/predictSalaryApp" component={PredictApp} />
        <Route path="/downloadApp" component={DownloadApp} />
        <Route path="/appLink" component={AppLink} />
        <Route path="/video" component={Video} />
        <Redirect from="*" to="/" />
      </Route>
    </Route>
  );
};
