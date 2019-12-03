import React, { PropTypes } from "react";
import "./index.less";
import * as HOSTS from '../../../src/config/host';

class DataPic extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  render() {
    console.log(this.context.router)
    if (
      !this.context.router ||
      !this.context.router.location ||
      JSON.stringify(this.context.router.location.query) === "{}"
    ) {
      return null;
    }
    let { pic } = this.context.router.location.query;
    pic =
      pic && pic !== ""
        ? HOSTS.CDN + "/" +
        pic
        : "";
    return (
      <div className="datapic">
        <img src={pic} style={{display: 'block', height: '100%', width: '100%'}}/>
      </div>
    );
  }
}
export default DataPic;
