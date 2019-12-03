import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.less'

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/page1/index',
      'pages/page2/index',
      'pages/page3/index',
      'pages/page4/index',
      'pages/page5/index',
      'pages/page6/index',
      'pages/page7/index',
      'pages/page8/index',
      'pages/page9/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    // 小程序端样式引用本地资源内联
    url: {
      enable: true,
      config: {
        limit: 1024000 // 设定转换尺寸上限
      }
    }
  }

  constructor () {
    super(...arguments)

    this.state = {
      isFromIndex: false,
    }
  }

  componentDidMount () {}

  componentDidShow () {
    console.log("componentDidShow all", this.$router.params)
    if(this.$router.params.path && this.$router.params.path === "pages/index/index" && !this.state.isFromIndex){
      Taro.hideLoading();
      this.setState({
        isFromIndex: true
      })
    } else {
      if(!this.state.isFromIndex){
        Taro.showLoading({
          title: "请稍后..."
        })
        // 跳转到目的页面，在当前页面打开
        Taro.redirectTo({
          url: `/pages/index/index`
        })
      }
    }

    // 通过转发入口进来获取到的数据
    if (this.$router.params.shareTicket) {
      //const shareTicket = this.$router.params.shareTicket
      /* Taro.showModal({
        title: 'shareTicket ok！',
        content: shareTicket,
        showCancel: false
      }) */
      /* Taro.getShareInfo({ shareTicket }).then(res => {
        console.log('getShareInfo', res)
      }) */
      // 跳转到目的页面，在当前页面打开
      /* Taro.redirectTo({
        url: `/pages/index/index`
      }) */
    }
  }

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
