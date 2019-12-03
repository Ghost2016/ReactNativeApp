import React, { PropTypes } from "react";
import { isInWeiXin } from '../../libs/func'

class GamePageNum extends React.Component {

    constructor(props){
      super(props);
    }

    render() {
      const { num, total } = this.props;
      const _num = typeof num == "number" ? parseInt(num, 10) : 1;
      const _total = typeof total == "number" ? parseInt(total, 10) : 9;
      return (
        <div id="page_num" style={{
            position: 'relative',
            top: '7px',
            left: '17px',
            width: '79px',
            height: '24px',
            border: '0px #00f solid',
            zIndex: 5,
            textAlign: 'center',
          }}>
            <span style={{
              fontSize: '17px',
              fontWeight: '500',
              color: '#333',
            }}>{_num}/{_total}</span>
          </div>
      );
    }
  }

export default GamePageNum;
