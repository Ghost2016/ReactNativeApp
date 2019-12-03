import React, {PropTypes} from "react";
import "./index.less";
import WebCircleChart01 from "../chart/CircleChart01";
import WebCircleChart02 from "../chart/CircleChart02";
class SkillInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        power: "",
        salary: "",
        skill: "",
        up: "",
        targetName: "",
      }
    };
  }
  componentDidMount() {
    this.setState({
      query: {
        ...this.state.query,
        ...this.context.router.location.query
      }
    });
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  render() {
    if (
      !this.context.router ||
      !this.context.router.location ||
      JSON.stringify(this.context.router.location.query) === "{}"
    ) {
      return null;
    }
    const {power, salary, skill, up, targetName} = this.state.query;
    let _targetName = targetName ? targetName : '职场技能';
    if(skill) _targetName = ""
    return (
      <div className="skillinfobox">
        <p style={{ textAlign: "center", fontSize: "12px", color: "#333" }}>
          我刚刚完成了<span
            style={{
              display: "inline-block",
              color: "#000",
              fontWeight: "bold",
              padding: "0, 0.05rem"
            }}
          >
            {skill}
          </span>{_targetName}，{parseInt(up, 10) > 0 ? <span>职么力增长<span
            style={{
              display: "inline-block",
              color: "#000",
              fontWeight: "bold",
              padding: "0, 0.05rem"
            }}
          >
            {up}分
          </span>, </span>: null}<br/>加入我一起成长吧!
        </p>

        <div
          style={{
            background: "#fff9e6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "1.8rem",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              height: "0.74rem",
              width: "2.8rem",
              display: "flex"
            }}
          >
            <img
              src="./images/taskshare/share_H5_pic_Medal@2x.png"
              style={{ display: "block", height: "100%", width: "100%" }}
            />
          </div>
          <div
            style={{
              borderRadius: "0.6rem",
              background: "#feed9e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0.06rem",
              padding: "0.05rem 0.05rem"
            }}
          >
            <div
              style={{
                height: "0.50rem",
                borderRadius: "0.5rem",
                background: "#fcd230",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 0.2rem"
              }}
            >
              <p style={{ color: "#fff", fontSize: "0.16rem", margin: 0 }}>
                {skill}
              </p>
            </div>
          </div>
        </div>

        {/* 图表 */}
        <div
          style={{
            display: "flex",
            marginTop: "0.3rem",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div>
            <WebCircleChart01 value={power}/>
          </div>
          <div style={{ flex: 1, marginLeft: "0.9rem" }}>
            <WebCircleChart02 value={salary}/>
          </div>
        </div>
      </div>
    );
  }
}
export default SkillInfo;
