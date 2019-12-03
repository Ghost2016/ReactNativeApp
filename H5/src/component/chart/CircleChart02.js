import React from "react";
import { Layout } from "antd";
import "./index.less";
class WebCircleChart02 extends React.Component {
  render() {
    return (
      //   <div className="circleProgress_wrapper">
      //     <div className="wrapper right">
      //       <div className="circleProgress rightcircle" />
      //     </div>
      //     <div className="wrapper left">
      //       <div className="circleProgress leftcircle" />
      //     </div>
      //   </div>
      <div className="circleProgress_wrapper2">
        <div className="borderBox2"></div>

        <div className="wrapper2 right2">
          <div className="circleProgress2 rightcircle2" />
        </div>
        <div className="wrapper2 left2">
          <div className="circleProgress2 leftcircle2" />
        </div>

        <div className="centerBox2">
            <p style={{display: 'flex', padding: 0, margin: 0, fontSize: 20, color: '#fff', overflow: 'hidden'}}><span style={{fontSize: 14, color: '#fff', position: 'relative', top: 5}}>¥</span>{this.props.value}</p>
            <p style={{display: 'flex', padding:0, margin: 0, fontSize: 14, color: '#fff', marginTop: 5}}>预估薪资</p>
        </div>

        <div className="centerDot2">
          <div className="moveDot2">
            <div className="dot2" />
          </div>
        </div>
      </div>
    );
  }
}
export default WebCircleChart02;
