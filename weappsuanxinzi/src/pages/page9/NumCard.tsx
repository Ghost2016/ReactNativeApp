import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text, Input } from '@tarojs/components'
import numMoney from '../../images/suanxinzi/salary_pic_m@2x.png'
import numUp from '../../images/suanxinzi/salary_pic_number_bg_top@2x.png'
import numDown from '../../images/suanxinzi/salary_pic_number_bg_down@2x.png'
import num0 from '../../images/suanxinzi/salary_pic_0@2x.png'
import num1 from '../../images/suanxinzi/salary_pic_1@2x.png'
import num2 from '../../images/suanxinzi/salary_pic_2@2x.png'
import num3 from '../../images/suanxinzi/salary_pic_3@2x.png'
import num4 from '../../images/suanxinzi/salary_pic_4@2x.png'
import num5 from '../../images/suanxinzi/salary_pic_5@2x.png'
import num6 from '../../images/suanxinzi/salary_pic_6@2x.png'
import num7 from '../../images/suanxinzi/salary_pic_7@2x.png'
import num8 from '../../images/suanxinzi/salary_pic_8@2x.png'
import num9 from '../../images/suanxinzi/salary_pic_9@2x.png'

import './NumCard.less'

export default class NumCard extends Component {

    constructor(){
        super(...arguments)
    }

    render() {
      let img = numMoney;
      let _n = 0;
      if(typeof this.props.num == "number"){
        _n =  parseInt(this.props.num, 10);
        switch (_n) {
          case 0:
            img = num0
            break;
          case 1:
            img = num1
            break;
          case 2:
            img = num2
            break;
          case 3:
            img = num3
            break;
          case 4:
            img = num4
            break;
          case 5:
            img = num5
            break;
          case 6:
            img = num6
            break;
          case 7:
            img = num7
            break;
          case 8:
            img = num8
            break;
          case 9:
            img = num9
            break;
          default:
            break;
        }
      }

      return (
        <View className="num-card">
          <View className="num-card-up">
            <Image className="num-up" src={numUp} />
          </View>
          <View className="num-card-down">
            <Image className="num-down" src={numDown} />
          </View>
          <View className="num-center">
            <Image className="img-center" src={img} />
          </View>
        </View>
      );
    }
  }


