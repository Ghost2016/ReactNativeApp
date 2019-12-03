import React from 'react';  
import {  
  AppRegistry,
  PanResponder,
  StyleSheet,
  View,
  processColor,
  ScrollView,
} from 'react-native';
import {Tabs} from "antd-mobile";
import * as sdStyles from "@src/styles";
var CIRCLE_SIZE = 80;  
var CIRCLE_COLOR = 'blue';  
var CIRCLE_HIGHLIGHT_COLOR = 'pink';
export default class PanResponderExample extends React.Component{
  // statics: {
  //   title: 'PanResponder Sample',
  //   description: 'Shows the use of PanResponder to provide basic gesture handling.',
  // },
  state = {
    contentOffset: 400,
    new_contentOffset: 0
  }
  _panResponder = {}
  _previousLeft = 0
  _previousTop= 0
  _circleStyles= {}
  // circle: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 20;
    this._previousTop = 84;
    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop
      }
    };
  }

  componentDidMount() {
    this._updatePosition();
  }

  render() {
    const tabs = [{ title: "TOP榜" }, { title: "同侪榜" }];
    const tabsProps = {
      tabBarBackgroundColor: sdStyles.SDBGColorMinor,
      tabBarInactiveTextColor: "#dfdfdf",
      tabBarActiveTextColor: sdStyles.SDMainColor,
      tabBarUnderlineStyle: {
        left: 40,
        backgroundColor: "red",
        height: 0,
        width: "20%"
      }
    };
    // old
    _onScroll = (event) => {
      let y = event.nativeEvent.contentOffset.y;
      let height = event.nativeEvent.layoutMeasurement.height;
      let contentHeight = event.nativeEvent.contentSize.height;
      if(y)
      console.log('ly88', event.nativeEvent)
    }
    return (
      <View style={styles.container}>
        <ScrollView 
        bounces={false}
        style={{flex:1}}>
        <View style={{height:100,backgroundColor:'yellow'}}></View>
        <Tabs
          style={{flex:1,position:'relative',backgroundColor:'#920911'}}
          tabs={tabs}>
          <View
            // contentOffset={{y:this.state.new_contentOffset,x:0}}
            style={{backgroundColor:'green',flex:1}}>
            <ScrollView
            bounces={false}
            scrollEventThrottle={50}
            style={{height:500,backgroundColor:'orange'}}
            onScroll={this._onScroll}
            >
            <View
              style={{height:1000,width:350,backgroundColor:'purple',marginTop:50}}
            ></View></ScrollView>
          </View>
          <View
            style={{backgroundColor:'pink'}}>
          </View>
        </Tabs>

        {/* <View
          ref={(circle) => {
            this.circle = circle;
          }}
          style={styles.circle}
          {...this._panResponder.panHandlers}
        /> */}
        </ScrollView>
      </View>
    );
  }

  _highlight = function() {
    const circle = this.circle;
    circle && circle.setNativeProps({
      style: {
        backgroundColor: processColor(CIRCLE_HIGHLIGHT_COLOR)
      }
    });
  }

  _unHighlight = () => {
    const circle = this.circle;
    circle && circle.setNativeProps({
      style: {
        backgroundColor: processColor(CIRCLE_COLOR)
      }
    });
  }

  _updatePosition = () => {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  }

  _handlePanResponderGrant= (e: Object, gestureState: Object) => {
    this._highlight();
  }
  _handlePanResponderMove= (e: Object, gestureState: Object) => {
    this._circleStyles.style.left = this._previousLeft + gestureState.dx;
    this._circleStyles.style.top = this._previousTop + gestureState.dy;
    this._updatePosition();
    
    let new_contentOffset = this.state.contentOffset + gestureState.dy
    console.log('ly88', 'new_contentOffset', new_contentOffset)
    this.setState({
      new_contentOffset: new_contentOffset
    })
  }
  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    this._unHighlight();
    this.setState({
      contentOffset: this.state.new_contentOffset
    })
    this._previousLeft += gestureState.dx;
    this._previousTop += gestureState.dy;
  }
}


var styles = StyleSheet.create({  
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: CIRCLE_COLOR,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
});