/* @flow */
import React, { PureComponent } from "react";
import { View, Image, StatusBar, Text, Animated } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Touchable } from "./index";
import store from "@boot/store";
import ConnectWithActions from "@src/connectWithActions";
import { isIphoneX } from "@utils/iphonex";
const _styles = {
  container: {
    width: CSS.width(),
    height: CSS.heightWithStatusBar(),
    position: 'relative'
  },
  image: {
    flex:1,
    zIndex: 1000,
    top:0,
    left:0,
    position: 'absolute', 
    width: CSS.width(),
    height: CSS.heightWithStatusBar(),
  },
  middleVirtualBox: {
    zIndex: 1001,
    // borderColor: 'red',
    // borderWidth:4,
    borderWidth:0, 
    width: CSS.width(),
    marginTop: CSS.pixel(800, true),
    height: CSS.pixel(200, true)
  },
  bottomVirtualBox: {
    zIndex: 1001,
    // borderColor: 'red',
    // borderWidth:4,
    borderWidth:0, 
    width: CSS.width(),
    marginTop: isIphoneX() ? CSS.pixel(940, true) : CSS.pixel(1040, true),
    height: CSS.pixel(200, true)
  }
}

type Props = {
  type: string,
  onReadAll: object
};

class SDGuidePage extends PureComponent {
  constructor(props) {
    super(props);
    let images = []
    if(isIphoneX()) {
      if(props.type === 'rank') {
        images = [
          {
            url: require('@img/guide/rank01@X.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/rank02@X.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/rank03@X.png'),
            buttonPos: 'middle' 
          },
        ]
      } else {
        images = [
          {
            url: require('@img/guide/index01@X.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/index02@X.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/index03@X.png'),
            buttonPos: 'bottom' 
          },
        ]
      }
    } else {
      if(props.type === 'rank') {
        images = [
          {
            url: require('@img/guide/rank01.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/rank02.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/rank03.png'),
            buttonPos: 'middle' 
          },
        ]
      } else {
        images = [
          {
            url: require('@img/guide/index01.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/index02.png'),
            buttonPos: 'middle' 
          },
          {
            url: require('@img/guide/index03.png'),
            buttonPos: 'bottom' 
          },
        ]
      }
    }
    
    
    this.state = {
      index: 0,
      images: images,
      left: new Animated.Value(0)
    }
  }
  static defaultProps = {
    type: 'rank',
    onReadAll: () => {}
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  maxIndex = 2
  
  props: Props;
  handlePress = () => {
    // console.warn('press')
    if(this.state.index === this.maxIndex) {
      if(this.props.type === 'rank') {
        this.props.actions.updateBaseInfoAction({
          settings: JSON.stringify({
            ...JSON.parse(this.props.settings),
            notFirstEnterRank: true
          })
        })
      } else {
        this.props.actions.updateBaseInfoAction({
          settings: JSON.stringify({
            ...JSON.parse(this.props.settings),
            notFirstEnterIndex: true
          })
        })
      }
      return
    }
    this.setState({
      index: this.state.index + 1
    }, () => {
      Animated.timing(this.state.left, {
        toValue: - this.state.index * CSS.width(),
        duration: 300
      }).start();
    })
  }
  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }
  componentWillUnmount() {
    // StatusBar.setHidden(false)
  }
  onNavigatorEvent(event) {
    switch (event.id) {
      case "willAppear":
        // StatusBar.setHidden(true)
        // this.context.navigator.toggleTabs({
        //   to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
        //   animated: false // does the toggle have transition animation or does it happen immediately (optional)
        // });
        break;
      case "willDisappear":
        // StatusBar.setHidden(false)
        // this.context.navigator.toggleTabs({
        //   to: 'shown', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
        //   animated: false // does the toggle have transition animation or does it happen immediately (optional)
        // });
        break;
    }
  }
  render() {
    const { index, images } = this.state;
    return (
      <View style={[_styles.container]}>
        <Animated.View style={{
          width: '300%',
          marginLeft: this.state.left
        }}>
          {/* {(index === 0) && <Image style={_styles.image} source={images[index].url} resizeMode="stretch"></Image>}
          {(index === 1) && <Image style={_styles.image} source={images[index].url} resizeMode="stretch"></Image>}
          {(index === 2) && <Image style={_styles.image} source={images[index].url} resizeMode="stretch"></Image>} */}
          {<Image style={[_styles.image, {left:0}]} source={images[0].url} resizeMode="stretch"></Image>}
          {<Image style={[_styles.image, {left:CSS.width() }]} source={images[1].url} resizeMode="stretch"></Image>}
          {<Image style={[_styles.image, {left:CSS.width() * 2}]} source={images[2].url} resizeMode="stretch"></Image>}
        </Animated.View>
        {images[index].buttonPos === 'middle' && <Touchable onPress={this.handlePress} style={_styles.middleVirtualBox}></Touchable>}
        {images[index].buttonPos === 'bottom' && <Touchable onPress={this.handlePress} style={_styles.bottomVirtualBox}></Touchable>}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  settings: (state.user && state.user.settings) || '{}'
}))(SDGuidePage);