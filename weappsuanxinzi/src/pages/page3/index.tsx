//import PropTypes from 'prop-types';
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
//import { connect } from '@tarojs/redux'
import { letters, cityQuestions, positionTags } from '../../lib/data'

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
    navigationBarTitleText: '算薪资-3'
  }

  constructor () {
    super(...arguments)

    this.state = {
      pageNum: 3,
      pageTotal: 9,
      pageTitles: [],
      city: '',
      position: '',
      positionName: '',
      isMultiSelect: false,
      cityArr: ['北京','上海','广州','深圳','杭州','成都','重庆','武汉','西安'],
      positionArr: ['产品狗','攻城狮','射鸡湿','运营人猿','市场商务','暖心行政'],
      data: [],
    }
  }

  componentWillMount () {
    console.log(this.$router.params)
    if(this.$router.params.position && this.state.positionArr.includes(this.$router.params.position)){
      let positionsByGroup = [];
      positionTags[this.$router.params.position].map((n,i)=>{
        positionsByGroup.push({
          title: n,
          isSelected: false,
        })
      })
      //console.log('positionsByGroup', positionsByGroup, positionTags[this.$router.params.position], this.$router.params.position)
      this.setState({
        city: this.$router.params.city,
        position: this.$router.params.position,
        pageTitles: ["选择职位标签"],
        data: positionsByGroup
      })
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
        positionName: item.title
      });
    }

    setTimeout(() => {
      // 跳转到目的页面，在当前页面打开
      Taro.redirectTo({
        url: `/pages/page4/index?city=${this.state.city}&position=${this.state.position}&position_name=${this.state.positionName}`
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
                  //const letter = letters[index];
                  const innerClass = item.isSelected ? 'inner active' : 'inner'
                  return (
                    <View key={index} className='label three fix'>
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

