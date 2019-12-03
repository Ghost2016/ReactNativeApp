import React, { PropTypes } from "react";
import "./index.less";
import { downloadApp } from '../../libs/func'

class registerActivity extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }
  static contextTypes = {
    // router: PropTypes.object.isRequired
  }
  componentDidMount() {
  }

  download(){
    downloadApp();
  }

  render() {
      return (
        <div className="container">
          {/* <div className="yellow-background"></div> */}
          <img className="img" src={require('../images/register_activity/full_image.png')}></img>
          <div className="footContainer">
            <div className="footButton">
              <span>立即下载注册</span>
            </div>
          </div>
        </div>
      )
  }
}
export default registerActivity;