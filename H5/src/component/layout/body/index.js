import React from 'react';
import './index.less';
class Body extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
export default Body;