import React from "react";
import { Layout } from "antd";
import "./index.less";
class WebCircleChart01 extends React.Component {
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
      <div className="circleProgress_wrapper">
        <div className="borderBox"></div>

        <div className="wrapper right">
          <div className="circleProgress rightcircle" />
        </div>
        <div className="wrapper left">
          <div className="circleProgress leftcircle" />
        </div>

        <div className="centerBox">
            <p style={{display: 'flex', padding: 0, margin: 0, fontSize: 20, color: '#fff'}}>{this.props.value}<span style={{fontSize: 16, color: '#fff', position: 'relative', top: 3}}>分</span></p>
            <p style={{display: 'flex', padding:0, margin: 0, fontSize: 14, color: '#fff', marginTop: 5}}>职么力</p>
        </div>

        <div className="centerDot">
          <div className="moveDot">
            <div className="dot" />
          </div>
        </div>
      </div>
    );
  }
}
export default WebCircleChart01;
