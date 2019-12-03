import React, { PropTypes } from "react";
import { Layout } from "antd";
import "./index.less";
import WebCircleChart01 from "../chart/CircleChart01";
import WebCircleChart02 from "../chart/CircleChart02";

class TrackSkill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        power: "",
        salary: "",
        task: ""
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
    const { power, salary, task } = this.state.query;
    const screenWidth = window.screen.width || document.documentElement.clientWidth;
    return (
      <div className="skillinfobox2" style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '5px',
      }}>
        <div style={{
          display: "flex",
          width: '80%',
          alignSelf: 'center',
          height: '30px',
          lineHeight: '210%',
          padding: '0',
          margin: '0.3rem auto',
          flexDirection: 'row',
          background: '#eee',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
        }}>职业路径规划，定向成长进阶</div>
        <div
          style={{
            display: "flex",
            width: '100%',
            //height: '100%',
            padding: "0.2rem 0.3rem 0.0rem 0.3rem",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderWidth: '1px',
          }}
        >
            {/* <SkillItem title={screenWidth <= 320 ? "职么开门" : "我在职么开门"} unit="项" subInfo="完成任务" count={task || ""}/> */}
            <SkillItem title={screenWidth <= 320 ? "路径规划" : "未来路径规划"} style={{marginLeft: "0.3rem", marginRight: '0.3rem'}} unit="分" subInfo="职么力" count={power|| ""}/>
            <SkillItem title={screenWidth <= 320 ? "成长进阶" : "定向成长进阶"} unit="¥" subInfo="预估薪资" count={salary || ""} isSalary={true}
            style={{marginLeft: "0.3rem", marginRight: '0.3rem'}}
            />
        </div>
      </div>
    );
  }
}

type PropsItem = {
    style: ?object,
    title: stirng,
    unit: string,
    isSalary: ?boolean,
    subInfo: stirng,
    count: string
}

class SkillItem extends React.PureComponent<PropsItem> {
  render() {
    const style = this.props.style || {};
    return (
      <div
        style={{
          display: "flex",
          flexDirection: 'column',
          ...style
        }}
      >
        {/* <div
          className="skillinfo"
          style={{
            position: "relative",
            background: "#eee",
            padding: "0 0.2rem",
            color: "#333",
            fontSize: "0.24rem",
            textAlign: "center",
            lineHeight: "0.5rem",
            height: "0.5rem",
            marginBottom: "0.22rem",
            minWidth: '1.9rem',
            borderRadius: '0.3rem'
          }}
        >
          {this.props.title}
        </div> */}
        <div className="skillimg">
          <div
            style={{
              position: "absolute",
              bottom: "0.4rem",
              left: "55%",
              width: '100%',
              transform: "translate(-50%, 0)",
              textAlign: "center",
              top: '1.20rem',
            }}
          >
            {this.props.isSalary ? (
              <p style={{margin: 0, padding: 0, overflow: 'hidden', flexDirection: 'row',alignItems: 'center',}}>
                <span style={{fontSize: '0.16rem', color: '#666', margin: 0, padding: 0}}>{this.props.unit}</span> <span style={{fontSize: '0.44rem', color: '333', margin: 0, padding: 0, fontFamily: 'DINCondensedC',}}>{this.props.count}</span>
              </p>
            ) : (
                <p style={{margin: 0, padding: 0, overflow: 'hidden', flexDirection: 'row',alignItems: 'center',}}>
                <span style={{fontSize: '0.44rem', color: '333', margin: 0, padding: 0, fontFamily: 'DINCondensedC',}}>{this.props.count}</span> <span style={{fontSize: '0.16rem', color: '#666', margin: 0, padding: 0}}>{this.props.unit}</span>
              </p>
            )}
            <p style={{margin: 0, padding: 0, fontSize: '12px',position:'relative',top:'-6px', color: '#666'}}>{this.props.subInfo}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TrackSkill;
