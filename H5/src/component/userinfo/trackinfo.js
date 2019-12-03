import React, { PropTypes } from "react";
import { Layout } from "antd";
import "./index.less";
import * as HOSTS from '../../../src/config/host';

class TrackUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        name: "",
        gender: "",
        userpic: "",
        school: "",
        major: "",
        degree: ""
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
    let { name, school, major, degree, userpic, gender } = this.state.query;
    userpic =
      userpic && userpic !== ""
        ? HOSTS.CDN + "/" +
          userpic +
          "?imageView2/2/w/100/h/100"
        : gender && gender !== ""
          ? gender === "female"
            ? "./images/female@2x.png"
            : "./images/male@2x.png"
          : "./images/male@2x.png";
    return (
      <div className="userinfobox2">
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: "0.4rem",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <div
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "0.5rem",
                overflow: "hidden",
                background: "#ccc"
              }}
            >
              <img
                src={userpic}
                style={{ display: "block", width: "100%", height: "100%" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              marginTop: '0.2rem'
            }}
          >
            <p
              style={{
                display: "flex",
                color: "#333",
                fontSize: "12px",
                margin: 0
              }}
            >
              {name || ""}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: '0.2rem'
            }}
          >
            <p
              style={{
                display: "flex",
                color: "#999",
                fontSize: "12px",
                margin: 0
              }}
            >{`${school || ""} ${degree ? degree+"·" : ""} ${major || ""}`}</p>
          </div>
        </div>
      </div>
    );
  }
}
export default TrackUserInfo;
