import React, { PropTypes } from "react";
import "./index.less";
import * as HOSTS from '../../../src/config/host';

class TrackInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
          name: '',
          gender: '',
          userpic: '',
          school: '',
          major: '',
          degree: ''
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
    if (!this.context.router || !this.context.router.location || JSON.stringify(this.context.router.location.query) === '{}') {
      return null;
    }
    let { name, school, major, degree, userpic, gender } = this.state.query;
    console.log(name)
    userpic =
      userpic && userpic !== ""
        ? HOSTS.CDN + "/" + userpic + "?imageView2/2/w/100/h/100"
        : gender && gender !== ""
          ? gender === "female"
            ? "./images/female@2x.png"
            : "./images/male@2x.png"
          : "./images/male@2x.png";
    return (
      <div className="userinfobox">
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: "0.4rem",
            flexDirection: "row"
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
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
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
                flexDirection: "column",
                paddingLeft: "0.2rem"
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
              <p
                style={{
                  display: "flex",
                  color: "#999",
                  fontSize: "12px",
                  margin: 0,
                  marginTop: "0.14rem"
                }}
              >{`${school || ""} ${degree ? degree+"·" : ""} ${major || ""}`}</p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "1rem",
              height: "0.5rem",
              background: "#fed200",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p style={{ color: "#fff", margin: 0, fontSize: "12px" }}>
              + 关注
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default TrackInfo;
