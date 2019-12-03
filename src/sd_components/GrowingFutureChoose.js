/* @flow */
import React, { PureComponent } from "react";
import { Dimensions, View, Platform, Image, Text, ImageBackground } from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
//import IntlText from "@sd_components/IntlText";
import ButtonSection from "@sd_components/ButtonSection";
import ImageChoose from "@sd_components/ImageChoose";
import SDSection from "@sd_components/SDSection";
import { Toast } from "antd-mobile";
//import FootSpace from "@sd_components/FootSpace";
import SDButton from "./SDButton";
import SDImage from "./SDImage";
import SDRefreshFutureList from "./SDRefreshFutureList";
import Carousel, { Pagination } from "react-native-snap-carousel";
import FutureSimpleList from "@src/screens/tabScreen/Grow/FutureSimpleList";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {
  onPress: () => void
};
const iconClose = require("@img/grow/growing_ico_close.png");

class GrowingFutureChoose extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

  }
  state = {
    entries: ["专业对口", "同门经验", "同类去向", "高薪职位"],
    sliderWidth: width, //CSS.pixel(670),
    itemWidth: CSS.pixel(630),
    currIndex: 0,
    CarouselScrollEnabled: true,
  };

  componentWillMount = () => {

  };

  componentDidMount(){
      //console.log("this._carouselTargeJob==", this._carouselTargeJob)
      this.context.refs['_carouselTargeJob'] = this
      /* setTimeout(() => {
        this.setState({
          CarouselScrollEnabled: true,
        })
      }, 5000); */
  }

  onPressDismiss() {
    this.context.navigator.dismissLightBox();
  }

  changeSnap = index => {
    console.log("changeSnap", index);
    this.setState({
      currIndex: index
      //fadeAnim: new Animated.Value(0.0),
    });

    /* Animated.timing(this.state.fadeAnim, {
      toValue: 0.9,
      easing: Easing.inOut(Easing.ease),
      duration: 1000
    }).start();

    //if (index == 2)
    setTimeout(() => {
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        easing: Easing.inOut(Easing.ease),
        duration: 500
      }).start();
    }, 500); */
  };

  _renderItem({ item, index }) {
    switch (item) {
      case "专业对口":
        return (
            <SDRefreshFutureList
            target={0}
            style={{
              //backgroundColor: sdStyles.SDBGColorClick
              borderRadius: CSS.pixel(10),
            }}
            listItem={item => {
                return <FutureSimpleList
                  keyExtractor={item => item.id + ""}
                  key={item.id}
                  item={item}
                  type="专业对口"
                 />;
            }}
          />
        );
      case "同门经验":
        return (
          <SDRefreshFutureList
            target={1}
            style={{
              //backgroundColor: sdStyles.SDBGColorClick
              borderRadius: CSS.pixel(10),
            }}
            listItem={item => {
                return <FutureSimpleList
                  keyExtractor={item => item.id + ""}
                  key={item.id}
                  item={item}
                  type="同门经验"
                 />;
            }}
          />
        );
      case "同类去向":
        return (
          <SDRefreshFutureList
            target={2}
            style={{
              //backgroundColor: sdStyles.SDBGColorClick
              borderRadius: CSS.pixel(10),
            }}
            listItem={item => {
                return <FutureSimpleList
                  keyExtractor={item => item.id + ""}
                  key={item.id}
                  item={item}
                  type="同类去向"
                />;
            }}
          />
        );
      case "高薪职位":
          return (
            <SDRefreshFutureList
              target={3}
              style={{
                //backgroundColor: sdStyles.SDBGColorClick
                borderRadius: CSS.pixel(10),
              }}
              listItem={item => {
                  return <FutureSimpleList
                    keyExtractor={item => item.id + ""}
                    key={item.id}
                    item={item}
                    captionBefore="¥"
                    captionAfter=""
                    type="高薪职位"
                  />;
              }}
            />
          );
      default:
        break;
    }
  }

  render() {
    const { style, title, index } = this.props;
    const _index = typeof index == "number" ? index : 0;
    return (
      <View style={[{
        //backgroundColor: '#ccc', //sdStyles.SDBGColorClick,
        backgroundColor: "transparent",
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: '#f00',
        width: "100%",
        height: height,
      }, style]}>
        <Carousel
          style={{ zIndex: 2 }}
          ref={c => {
            this._carouselTargeJob = c;
          }}
          data={this.state.entries}
          firstItem={_index}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={this.state.sliderWidth}
          itemWidth={this.state.itemWidth}
          //scrollEnabled={this.state.CarouselScrollEnabled}
          scrollEnabled={true}
          //enableMomentum={false}
          onSnapToItem={this.changeSnap.bind(this)}
          inactiveSlideOpacity={1}
          testID={"Carousel_future"}
          activeSlideOffset={20}
          swipeThreshold={10}
          callbackOffsetMargin={10}
          //pointerEvents={'none'}
          //lockScrollWhileSnapping={true}
          autoplay={false}
        />
        <SDButton
            style={{
              flexDirection: "column",
              alignContent: "stretch",
              justifyContent: "center",
              backgroundColor: "transparent",
              borderRadius: 0,
              zIndex: 8,
              borderWidth: 0,
              borderColor: "#f0f",
              marginTop: CSS.pixel(40, true),
              width: CSS.pixel(80),
              height: CSS.pixel(80, true)
            }}
            btnStyle={{
              fontSize: CSS.pixel(30),
              color: "#fff",
              borderWidth: 0,
              borderColor: "#0ff"
            }}
            onPress={this.onPressDismiss.bind(this)}
            title={() => {
              return (
                <Image
                  source={iconClose}
                  style={{
                    width: CSS.pixel(43),
                    height: CSS.pixel(43, true)
                  }}
                />
              );
            }}
          />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
}))(GrowingFutureChoose);
