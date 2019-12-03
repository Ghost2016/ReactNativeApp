import React, { PropTypes } from "react";
import { Config, CSS, isMobile, checkResult,
  openNotificationWithIcon,
  //notValidField,
  //_onPressGetCode,
 } from '../../libs/func'
class GamePage extends React.Component {

    constructor(props){
      super(props);
    }

    render() {
      const { num, children } = this.props;
      const _num = typeof num == "number" ? parseInt(num, 10) : 0;
      return (
        <div className={"suanxinzi-page page-"+_num} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          height: _num == 9 ? CSS.px(1306) : CSS.px(1206),
        }}>{children}</div>
      );
    }
  }

export default GamePage;
