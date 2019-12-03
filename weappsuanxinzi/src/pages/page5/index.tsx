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

//['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座']
import icon0 from '../../images/suanxinzi/home_ico_Aries_nor@2x.png'
import icon0Select from '../../images/suanxinzi/home_ico_Aries_sel@2x.png'
import icon1 from '../../images/suanxinzi/home_ico_Taurus_nor@2x.png'
import icon1Select from '../../images/suanxinzi/home_ico_Taurus_sel@2x.png'
import icon2 from '../../images/suanxinzi/home_ico_Gemini_nor@2x.png'
import icon2Select from '../../images/suanxinzi/home_ico_Gemini_sel@2x.png'
import icon3 from '../../images/suanxinzi/home_ico_Cancer_nor@2x.png'
import icon3Select from '../../images/suanxinzi/home_ico_Cancer_sel@2x.png'
import icon4 from '../../images/suanxinzi/home_ico_Leo_nor@2x.png'
import icon4Select from '../../images/suanxinzi/home_ico_Leo_sel@2x.png'
import icon5 from '../../images/suanxinzi/home_ico_Virgo_nor@2x.png'
import icon5Select from '../../images/suanxinzi/home_ico_Virgo_sel@2x.png'
import icon6 from '../../images/suanxinzi/home_ico_Libra_nor@2x.png'
import icon6Select from '../../images/suanxinzi/home_ico_Libra_sel@2x.png'
import icon7 from '../../images/suanxinzi/home_ico_Scorpio_nor@2x.png'
import icon7Select from '../../images/suanxinzi/home_ico_Scorpio_sel@2x.png'
import icon8 from '../../images/suanxinzi/home_ico_Sagittarius_nor@2x.png'
import icon8Select from '../../images/suanxinzi/home_ico_Sagittarius_sel@2x.png'
import icon9 from '../../images/suanxinzi/home_ico_Capricorn_nor@2x.png'
import icon9Select from '../../images/suanxinzi/home_ico_Capricorn_sel@2x.png'
import icon10 from '../../images/suanxinzi/home_ico_Aquarius_nor@2x.png'
import icon10Select from '../../images/suanxinzi/home_ico_Aquarius_sel@2x.png'
import icon11 from '../../images/suanxinzi/home_ico_Pisces_nor@2x.png'
import icon11Select from '../../images/suanxinzi/home_ico_Pisces_sel@2x.png'

const icons = [
  {
    default: icon0,
    select: icon0Select,
  },
  {
    default: icon1,
    select: icon1Select,
  },
  {
    default: icon2,
    select: icon2Select,
  },
  {
    default: icon3,
    select: icon3Select,
  },
  {
    default: icon4,
    select: icon4Select,
  },
  {
    default: icon5,
    select: icon5Select,
  },
  {
    default: icon6,
    select: icon6Select,
  },
  {
    default: icon7,
    select: icon7Select,
  },
  {
    default: icon8,
    select: icon8Select,
  },
  {
    default: icon9,
    select: icon9Select,
  },
  {
    default: icon10,
    select: icon10Select,
  },
  {
    default: icon11,
    select: icon11Select,
  },
]

class Index extends Component {
  config = {
    navigationBarTitleText: '算薪资-5'
  }

  constructor () {
    super(...arguments)

    this.state = {
      pageNum: 5,
      pageTotal: 9,
      pageTitles: ['这年头，新朋友认识不问问星', '座都不好意思聊天，那你是？'],
      city: '',
      position: '',
      positionName: '',
      degree: '',
      constellation: '',
      isMultiSelect: false,
      cityArr: ['北京','上海','广州','深圳','杭州','成都','重庆','武汉','西安'],
      positionArr: ['产品狗','攻城狮','射鸡湿','运营人猿','市场商务','暖心行政'],
      degreeArr: ['博士真学霸','硕士学问家','本科大法好','专科逆袭王'],
      data: [],
    }
  }

  componentWillMount () {
    //console.log(this.$router.params)
    if(this.$router.params.position_name && positionTags.hasOwnProperty(this.$router.params.position)
      && positionTags[this.$router.params.position].includes(this.$router.params.position_name) && this.$router.params.degree && this.state.degreeArr.includes(this.$router.params.degree)){

      let horoscope = [];
      constellations.map((n,i) => {
        horoscope.push({
          title: n,
          isSelected: false,
        })
      })
      this.setState({
        city: this.$router.params.city,
        position: this.$router.params.position,
        positionName: this.$router.params.position_name,
        degree: this.$router.params.degree,
        data: horoscope
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
        constellation: item.title
      });
    }

    setTimeout(() => {
      // 跳转到目的页面，在当前页面打开
      Taro.redirectTo({
        url: `/pages/page6/index?city=${this.state.city}&position=${this.state.position}&position_name=${this.state.positionName}&degree=${this.state.degree}&constellation=${this.state.constellation}`
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
                  const icon = item.isSelected ? icons[index].select : icons[index].default;
                  return (
                    <View key={index} className='label four fix'>
                      <View className='header-icon'>
                      <Image
                          className='icon img'
                          src={icon}
                          onClick={this.clickBtn.bind(null, index, item)}
                        />
                      </View>
                      <View className='choose-label small' onClick={this.clickBtn.bind(null, index, item)}>
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

