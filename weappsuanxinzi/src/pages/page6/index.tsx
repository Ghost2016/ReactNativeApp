//import PropTypes from 'prop-types';
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
//import { connect } from '@tarojs/redux'
//import { add, minus, asyncAdd } from '../../actions/counter'
import { letters, positionTags, constellations } from '../../lib/data'
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
    navigationBarTitleText: '算薪资-6'
  }

  constructor () {
    super(...arguments)

    this.state = {
      pageNum: 6,
      pageTotal: 9,
      pageTitles: ['正确的自我认识'],
      city: '',
      position: '',
      positionName: '',
      degree: '',
      constellation: '',
      gender: '',
      isMultiSelect: false,
      cityArr: ['北京','上海','广州','深圳','杭州','成都','重庆','武汉','西安'],
      positionArr: ['产品狗','攻城狮','射鸡湿','运营人猿','市场商务','暖心行政'],
      degreeArr: ['博士真学霸','硕士学问家','本科大法好','专科逆袭王'],
      constellationArr: ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'],
      data: [
        {
          title: '安静的美男子',
          isSelected: false,
        },
        {
          title: '豪迈的萌妹子',
          isSelected: false,
        },
      ],
    }
  }

  componentWillMount () {
    //console.log(this.$router.params)
    if(this.$router.params.position_name && positionTags.hasOwnProperty(this.$router.params.position)
      && positionTags[this.$router.params.position].includes(this.$router.params.position_name) && this.$router.params.degree && this.state.degreeArr.includes(this.$router.params.degree)
      && this.$router.params.constellation && this.state.constellationArr.includes(this.$router.params.constellation)
      ){
      this.setState({
        city: this.$router.params.city,
        position: this.$router.params.position,
        positionName: this.$router.params.position_name,
        degree: this.$router.params.degree,
        constellation: this.$router.params.constellation,
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
      console.log("item.title", item.title)
      if(!this.state.isMultiSelect) this.setState({
        gender: item.title
      });
    }

    setTimeout(() => {
      // 跳转到目的页面，在当前页面打开
      Taro.redirectTo({
        url: `/pages/page7/index?city=${this.state.city}&position=${this.state.position}&position_name=${this.state.positionName}&degree=${this.state.degree}&constellation=${this.state.constellation}&gender=${this.state.gender}`
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
                    <View key={index} className='label one'>
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

