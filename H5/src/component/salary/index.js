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

      <div className="salarypic">
        <div><img src={pic} style={{display: 'block', width: '100%'}}/>
        </div>
        <div style={{height: '1.3rem', background: '#fd844a', paddingTop: '0.3rem', position: 'relative', top: '-1px'}}>
            <p style={{background: '#fed200', color: '#fff', fontSize: '0.24rem', padding: 0, margin: '0 auto', textAlign: 'center', width: '4rem', borderRadius: '0.4rem', height: '0.7rem', lineHeight: '0.7rem'}}>我也要测一测</p>
        </div>
      </div>
    );
  }
}
export default DataPic;
