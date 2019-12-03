//import PropTypes from 'prop-types';
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
//import { connect } from '@tarojs/redux'
//import { add, minus, asyncAdd } from '../../actions/counter'
import { letters } from '../../lib/data'

import './index.less'

/* @connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  }
})) */

class Index extends Component {
  config = {
    navigationBarTitleText: '算薪资-1'
  }

  constructor () {
    super(...arguments)

    this.state = {
      pageNum: 1,
      pageTotal: 9,
      pageTitles: ['日照香炉升紫烟', '姐们儿你在哪混圈？'],
      city: '',
      isMultiSelect: false,
      data: [
        {
          title: '北京',
          isSelected: false,
        },
        {
          title: '上海',
          isSelected: false,
        },
        {
          title: '广州',
          isSelected: false,
        },
        {
          title: '深圳',
          isSelected: false,
        },
        {
          title: '杭州',
          isSelected: false,
        },
        {
          title: '成都',
          isSelected: false,
        },
        {
          title: '重庆',
          isSelected: false,
        },
        {
          title: '武汉',
          isSelected: false,
        },
        {
          title: '西安',
          isSelected: false,
        },
      ],
    }
  }

  componentWillReceiveProps (nextProps) {
    //console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  clickBtn = (index, item, e) => {
    e.stopPropagation()
    let tmp = this.state.data
    if(!this.state.isMultiSelect){
      for(let i=0,imax=tmp.length;i<imax;i++){
        tmp[i].isSelected = false;
      }
    }
    if(tmp[index] && tmp[index].title === item.title){
      tmp[index].isSelected = !tmp[index].isSelected;
      this.setState({
        data: tmp
      });
      if(!this.state.isMultiSelect) this.setState({
        city: item.title
      });
    }

    setTimeout(() => {
      // 跳转到目的页面，在当前页面打开
      Taro.redirectTo({
        url: `/pages/page2/index?city=${this.state.city}`
      })
    }, 1000);
  }

  render () {
    return (
      <View className='sxz-page'>
        <View className='sxz-container'>
          <View className='align-center' >
            <View className='mainBg' >
              <View className='pageHeader' >
                <Text className='txt header-num'>
                {this.state.pageNum}/{this.state.pageTotal}</Text>
              </View>
              <View className='pageTitle' >
                {this.state.pageTitles.map((item, index) => {
                  return (
                    <View key={index} className='header-title'>
                      <Text className='txt header-title-span'>{item}</Text>
                    </View>
                  )
                })}
              </View>
              <View className='pageContent' >
                {this.state.data.map((item, index) => {
                  const letter = letters[index];
                  const innerClass = item.isSelected ? 'inner active' : 'inner'
                  return (
                    <View key={index} className='label'>
                      <View className='header-letter'>
                        <Text className='txt'>{letter}.</Text>
                      </View>
                      <View className='choose-label' onClick={this.clickBtn.bind(null, index, item)}>
                        <View className={innerClass} >
                          <Text className='txt'>{item.title}</Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Index

