/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  PixelRatio,
  PanResponder
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle, { navLightBox } from "@styles";
import { getSuitableSize } from "../utils/qiniupic";
import { CSS } from "../common/SDCSS";
import ImageZoomPreview from "../common/ImageZoomPreview";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

type Props = {
  avatar: string,
  userName: string,
  time: stirng,
  content: string,
  bordered: boolean
};

const screenWidth = Dimensions.get("window").width;

const screenHeight = Dimensions.get("window").height;

// 动态信息List
export default class TrendsList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      images: [],
      imagesHandled: [],
    }
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  handleImg(images){
    const arr = getSuitableSize(images, screenWidth - 160, 150, this.props.isTab1)
    this.setState({
      imagesHandled: arr,
    })
  }

  onClickImages(index) {
    // 当前图片index
    // navLightBox("LightBoxScreen", {
    //   passProps: {
    //     screen: () => <ImageZoomPreview onClose={() => {
    //       this.state.visible = false;
    //     }} _root={this._root}/>
    //   }
    // });
    // this.setState({
    //   visible: true
    // });
    // return;
    const imagesUrl = this.state.images.map(item => {
      // let desc = JSON.parse(item.desc);
      if (typeof item.desc === "string") {
        item.desc = JSON.parse(item.desc);
      }
      if (item.desc.width >= item.desc.height) {
        return { url: item.url + "?imageView2/2/w/" + (screenWidth * PixelRatio.get())};
      } else {
        return { url: item.url + "?imageView2/2/h/" + (screenHeight - 20 * 2) * PixelRatio.get() };
      }
      // if (item.desc.width >= item.desc.height) {
      //   return { url: item.url };
      // } else {
      //   return { url: item.url };
      // }
    });
    this.props.getHistoryContext().setState({
      isShowImageViewer: true,
      imagesUrls: imagesUrl,
      imageViewerIndex: index
    });
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
      },
      onPanResponderMove: (e, gestureState) => {
          console.warn(gestureState.numberActiveTouches)
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {

      }
    });
    this.setState({
      images: this.props.images,
    })
    this.handleImg(this.props.images)

    if(this.props.images.length === 1) {
      setTimeout(() => {
        //console.warn("this.props.images2", this.props.images)
        this.setState({
          images: this.props.images,
        })
        this.handleImg(this.props.images)
      }, 1000);
    }

  }

  componentWillReceiveProps(nextProps){
    //if(nextProps.images.length !== this.props.images){
      /* console.warn("this.props.images", this.props.images)
      this.setState({
        images: this.props.images,
      }) */
    //}
  }

  render() {
    return (
      <View style={[styles.container, defaultStyle.center, {
        borderBottomColor: '#f3f3f3',
        borderBottomWidth: 1,
        paddingTop: CSS.pixel(20),
        // backgroundColor: 'red'
      }]}>
        <View
          style={[
            defaultStyle.flexRow,
            defaultStyle.center,
            { height: 40, paddingLeft: 10, marginTop: 10, }
          ]}
        >
          <View
            style={{
              width: CSS.pixel(70),
              height: CSS.pixel(70),
              borderRadius: CSS.pixel(35),
              borderColor: "#fff",
              borderWidth: 1,
              overflow: "hidden",
            }}
          >
            <Image
              style={{ width: CSS.pixel(70), height: CSS.pixel(70) }}
              source={
                this.props.avatar
                  ? { uri: this.props.avatar + "?imageView2/2/h/120" }
                  : this.props.gender == "female"
                    ? require("@img/avator/female.png")
                    : require("@img/avator/male.png")
              }
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 3,
              top: 2,
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <Text style={{ color: "#333", fontSize: CSS.textSize(28) }}>
              {this.props.userName}
            </Text>
            <Text style={{ color: "#999", fontSize: CSS.textSize(24), paddingTop: 0,
            position: 'relative',
            top: -2,
          }}>
              {this.props.time}
            </Text>
          </View>
        </View>
        {this.props.content && this.props.content !== "" ? (
          <View
            style={[
              defaultStyle.flexRow,
              defaultStyle.center,
              {
                minHeight: 40,
                paddingLeft: 40,
                paddingRight: 40,
                marginBottom: this.state.images && this.state.images.length > 0 ? 0 : 10,
                marginLeft: 4,
                marginTop: 4,
              }
            ]}
          >
            {/* <View style={{ width: 30, height: 30, borderBottomColor: '#f1f1f1', borderBottomWidth:this.props.bordered?1: 0  }} /> */}

            <View
              style={{
                // height: 30,
                width: "100%",
                justifyContent: "center",
                paddingHorizontal: 3,
              }}
            >
              <Text style={{ color: "#333", fontSize: 15, lineHeight: 20 }}>
                {this.props.content}
              </Text>
            </View>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingLeft: 40,
            paddingRight: this.state.images.length == 4 ? 120 : 60,
            marginLeft: 8,
            marginTop: 2,
            //backgroundColor: 'yellow',
            width: "100%",
            marginBottom: this.state.images && this.state.images.length ? 20 : 0
          }}
        >
          {this.state.images.length
            ? this.state.imagesHandled.map(
                (item, index) => {
                  // console.warn(item.url)
                  return (
                    <View
                      key={index + ""}
                      style={{
                        width: item.width + 6,
                        height: item.height + 6,
                        padding: 3, //CSS.pixel(10),
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: (index == 1 && this.state.images.length == 5) ? 80 : 0,
                        //backgroundColor: 'red',
                        //borderWidth: 1,
                        //borderColor: "#003000"
                      }}
                    >
                      <TouchableOpacity
                        ref={c => this._root = c}
                        key={index + ""}
                        style={{
                          //flex: 1,
                          width: item.width,
                          height: item.height,
                          borderWidth: 0,
                          borderColor: '#ff0',
                         }}
                        activeOpacity={0.8}
                        onPress={this.onClickImages.bind(this, index)}
                      >
                        <Image
                          source={{
                            uri: item.url
                          }}
                          resizeMode="cover"
                          style={{
                            width: item.width,
                            height: item.height,
                            borderWidth: 0,
                            borderColor: '#f00',
                           }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }
              )
            : null}
        </View>

        {this.props.bordered ? (
          <View
            style={{
              borderBottomColor: "#f1f1f1",
              borderBottomWidth: 1,
              width: Dimensions.get("window").width - 20,
              height: 1
            }}
          />
        ) : null}

        {/* <ImageZoomPreview onClose={() => {
          this.state.visible = false;
        }} _root={this._root} visible={this.state.visible}/> */}
      </View>
    );
  }
}
