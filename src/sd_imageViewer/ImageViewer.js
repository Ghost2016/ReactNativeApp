import React from "react";
import { View, Modal, Text, Image,Dimensions } from "react-native";
import { ActivityIndicator } from 'antd-mobile';
import RNImageViewer from 'react-native-image-zoom-viewer';

/**
 *  图片查看器
 */

export default class ImageViewer extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    // 正在进行查看的图片组合
    images: [],
    // 图片默认位置
    index: 0,
    show: true
  }
  componentDidMount() {
  }

  loadEnd = () => {
    // console.warn('load_end')
  }
  render() {
    const _props = this.props;
    const { show } = _props
    console.log(_props)
    return (
      <Modal
        visible={show}
        // animationType="slide"
        // Android, Platform.isTVOS
        onRequestClose={() => {
          (typeof _props.onRequestClose === 'function') && _props.onRequestClose()
        }}
        transparent={false}
        // transparent={true}
        >
        <RNImageViewer
          // enableSwipeDown={true}
          // onSwipeDown={() => {}}
          saveToLocalByLongPress={false}
          // onSaveToCamera={(index) => {}}
          // renderHeader={() => <Text style={{color:'#fff'}}>12345</Text>}
          // renderFooter={() => <Text style={{color:'#fff'}}>12345</Text>}
          // enableImageZoom={false}
          // backgroundColor='black'
          // footerContainerStyle={{
          //   bottom: 10, position: "absolute", zIndex: 9999
          // }}
          failImageSource={{
            url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=100",
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
          loadingRender={() => <View style={{height:"100%",justifyContent:'center',alignItems:'center'}}><ActivityIndicator animating={true}/></View>}
          // renderImage={($props) => (<View>
          //     <Image 
          //     {...$props} 
          //     loadingIndicatorSource={<View style={{height:"100%",justifyContent:'center',alignItems:'center'}}><ActivityIndicator animating={true}/></View>}
          //     onLoad={this.loadEnd}/>
          //   </View>)}
          {..._props}
        />
      </Modal>
    );
  }
}


