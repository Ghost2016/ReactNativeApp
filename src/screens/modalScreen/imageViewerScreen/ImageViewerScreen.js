import React from "react";
import { View, Dimensions } from "react-native";
import ConnectWithActions from "../../../connectWithActions";
import { ActivityIndicator } from 'antd-mobile';
import RNImageViewer from 'react-native-image-zoom-viewer';
import PropTypes from "prop-types";
import { CSS } from "../../../common/SDCSS";
type Props = {};
type State = {};

/**
 *  图片展示
 */

class ImageViewerScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  static defaultProps = {
    onRequestClose: () => {},
    show: true,
    animationType: 'none',
    transparent: true,
    // 正在进行查看的图片组合
    imageUrls: [],
    // 图片默认位置
    index: 0,
  }
  render() {
    const { index, onRequestClose, show, animationType, transparent, imageUrls, ...restProps } = this.props;
    return (
      <RNImageViewer 
      // style={{
      //   flex:1
      // }}
      onRequestClose={() => {
        this.context.navigator.dismissAllModals({animationType: animationType})
      }}
      onLongPress={() => {}}
      onClick={() => {
        this.context.navigator.dismissAllModals({animationType: animationType})
      }}
      // fail
      failImageSource={{
        url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=100",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
      }}
      loadingRender={() => <View style={{height:"100%",justifyContent:'center',alignItems:'center'}}><ActivityIndicator animating={true}/></View>}
      index={index}
      {...restProps}
      // prevent crach:cannot add property props object is not extensible
      imageUrls={JSON.parse(JSON.stringify(imageUrls))}
      />
    )
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({}))(
  ImageViewerScreen
));
