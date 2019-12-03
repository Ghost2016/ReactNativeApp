/* @flow */
import React, { PureComponent } from "react";
import { View, Text, Platform } from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { getUserPowerSalary } from "@src/users/usersSelector";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import ScroeProgress from "@src/sd_scroeprogress/ScroeProgress";


type Props = {};

class BarPowerSalary extends PureComponent<Props> {
  props: Props;

  componentDidMount = () => {
    console.log("this.props.user.up_power", this.props.user)
  };

  signNum(n){
    return parseInt(n, 10) > 0 ? `+${n}` : `${n}`;
  }

  render() {
    const { style, salary, barColor } = this.props;
    return (
            <View style={[{
              borderWidth: 0,
              borderColor: '#f00',
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: CSS.pixel(20, true),
              marginHorizontal: CSS.pixel(30),
            }, style]} >
              <View style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: CSS.pixel(110),
                //height: CSS.pixel(25, true),
              }}><Text style={{
                fontSize: CSS.textSize(24),
                color: sdStyles.SDFontColorMain,
                //fontFamily: 'PingFang SC',
                //fontWeight: '100',
                textAlign: 'right',
              }}>{salary? "预估薪资" : "职么力"} </Text></View>
              <View style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: CSS.pixel(240),
                marginLeft: CSS.pixel(10),
              }}>
                <ScroeProgress noTip={true} salary={salary}
                  barColor={barColor}
                />
              </View>
              <View style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: CSS.pixel(100),
                height: CSS.pixel(25, true),
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: CSS.pixel(10),
              }}>
                <Text style={{
                    fontSize: CSS.textSize(24),
                    color: sdStyles.SDFontColorMain,
                }}>{salary?"¥":""}</Text>
                <Text style={{
                fontSize: CSS.textSize(Platform.OS=="android"? 34 : 34),
                fontFamily: 'DINCondensedC',
                color: sdStyles.SDFontColorMain,
              }}>{salary?this.props.user.salary:this.props.user.power}</Text>
                <Text style={{
                fontSize: CSS.textSize(24),
                color: sdStyles.SDFontColorMain,
              }}>{salary?"":"分"}</Text>
              </View>
              <View style={{
                borderWidth: 0,
                borderColor: '#f00',
                //width: CSS.pixel(118),
                //flexGrow: 1,
                //overflow: 'visible',
                minWidth: CSS.pixel(110, true),
                height: CSS.pixel(40, true),
                paddingHorizontal: CSS.pixel(8),
              }}>
                <View
                  style={{
                    shadowOffset: {
                      width: Platform.OS=="android"? 0 : 0,
                      height: Platform.OS=="android"? 5 : 2,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: Platform.OS=="android"? 5 : 3,
                    shadowColor: "#999",
                    //注意：这一句是可以让安卓拥有灰色阴影
                    elevation: 5,
                    backgroundColor: "#fff",
                    paddingHorizontal: CSS.pixel(8),
                    paddingVertical: CSS.pixel(4, true),
                    borderRadius: Platform.OS=="android"? 15 : 15,
                    width: '100%',
                    height: CSS.pixel(30, true),
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: Platform.OS=="android"? 0 : 0,
                    borderColor: Platform.OS=="android"? '#f5f5f5' : '#00f',
                  }}
                >
                  <Text style={{
                fontSize: CSS.textSize(20),
                color: sdStyles.SDFontColorMain,
              }}>较上周：</Text>
                  <Text style={{
                //fontWeight: '600',
                fontSize: CSS.textSize(20),
                color: sdStyles.SDMainColor,
              }}>{salary?this.signNum(this.props.user.up_salary):this.signNum(this.props.user.up_power)}</Text>
                </View>
              </View>
            </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
    user: getUserPowerSalary(state)
}))(BarPowerSalary);