import React, {PropTypes} from 'react';
import './index.less';
import { Config, isMobile, isInWeiXin, downloadApp } from '../../libs/func'

class FooterDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isappinstalled: 0,
            isShareToFreind: 0,
        }
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    componentDidMount() {
        // 微信
        if (window.location.href.toString().indexOf("isappinstalled=1") >= 0) {
            this.setState({
                isappinstalled: 1
            })
        } else if(window.location.href.toString().indexOf("appinstall=1") >= 0) {
            // QQ
            this.setState({
                isappinstalled: 1
            })
        }
        if (window.location.href.toString().indexOf("/track?") >= 0) {
            console.log('isShareToFreind==', window.location.href.toString(), window.location.href.toString().indexOf("/track?"))
            this.setState({
                //只有分享给好友才是注册链接
                isShareToFreind: 1
            })
        }
    }

    download(){
        console.log("this.state.isShareToFreind", this.state.isShareToFreind)
        if (!this.state.isShareToFreind) {
            downloadApp();
        }
    }

    render() {
        return (
            <div className={this.props.black?"footer black":"footer"}>
                <div style={{width: '0.76rem', height: '0.76rem', display: 'flex'}}>
                    <img src="./images/taskshare/share_H5_ico_logo@2x.png" style={{display: 'block', height: '100%', width: '100%'}}/>
                </div>
                <div style={{display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0 0.3rem', textAlign: 'left',}}>
                    {!this.props.black?<p style={{color: '#333', fontSize: '0.26rem', margin: 0, padding: 0}}>职么开门-大学生的职业规划师</p>:null}
                    {this.props.black?<p style={{color: '#333', fontSize: '0.28rem', margin: 0, padding: 0}}>
                        <span style={{
                            fontSize: '14px',
                            color: '#fff',
                            lineHeight: '100%',
                            position: 'relative',
                            top: '2px',
                            left: '-10px',
                        }}>职么开门</span><br/>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '200',
                            color: '#fff',
                            lineHeight: '100%',
                            position: 'relative',
                            top: '-2px',
                            left: '-10px',
                        }}>大学生的职业规划师</span>
                    </p>:null}
                </div>
                <div onClick={this.download.bind(this)} style={{width: this.props.black?'100px':'1,6rem', height: this.props.black?'27px':'0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: this.props.black?'1px solid #FED200':'1px solid #fe8900', padding: '0.3rem',background: this.props.black?'#FED200':'transparent',}}>
                    {!this.state.isShareToFreind ? <p style={{color: this.props.black?'#333':'#fe8900', fontSize: this.props.black?'0.26rem':"0.28rem", margin: 0, padding: 0}}>
                        立即{this.state.isappinstalled && this.state.isappinstalled == 1 ? '打开' : '使用'}
                    </p> : null}

                    {this.state.isShareToFreind ? <a style={{background: this.props.black?'#FED200':'transparent',color: this.props.black?'#333':'#fe8900', fontSize: this.props.black?'12px':"0.26rem", margin: 0, padding: 0, lineHeight: '150%',letterSpacing: '-1px',}} href={"/#/register"}>
                        {'立即注册'}
                    </a> : null}

                </div>
            </div>
        )
    }
}
export default FooterDownload;