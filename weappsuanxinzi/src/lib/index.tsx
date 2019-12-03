import Taro from '@tarojs/taro'

export default function post(url: string, data: object) {
    Taro.request({
      url: url,
      data: data,
      success: res => {
        //Taro.hideLoading()
        /* if (res.data.code != 0) {
          Taro.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return
        } */
      }
    })
}

