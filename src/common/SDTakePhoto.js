import React, { PureComponent } from "react";
import { Text, View, Image, TouchableOpacity, Dimensions, ImageEditor, PixelRatio } from "react-native";
import PropTypes from "prop-types";
import { CSS } from "./SDCSS";
// import ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../connectWithActions";
import { getUserBaseInfo } from "../users/usersSelector";
import ActionSheet from "react-native-actionsheet";
import { imagesModel } from "../types";

const imagePickerOptions = {
  title: "请选择打开图片方式",
  takePhotoButtonTitle: "拍照",
  chooseFromLibraryButtonTitle: "图库",
  cancelButtonTitle: "取消"
  // storageOptions: {
  //   skipBackup: true,
  //   path: "images"
  // }
};

const itemWidth = parseInt(Dimensions.get("window").width / 3 - CSS.pixel(60), 10);

type Props = {
  defaultImages: imagesModel[]
}

class SDTakePhoto extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const [list, uploadIds] = this.initImages(this.props.defaultImages);
    this.state = {
      list: list,
      uploadIds: uploadIds,
      max: 10,
      previewImgWidth: this.props.dynamic ? itemWidth : 150,
      previewImgHeight: this.props.dynamic ? itemWidth : 100,
    };
  }

  initImages(defaultImages) {
    let list = [
    ].concat(defaultImages ? defaultImages.map(c => ({
      id: c.id,
      path: c.url + `?imageView2/2/w/${PixelRatio.get() * itemWidth}/h/${PixelRatio.get() * itemWidth}`,
      filename: c.file_name,
      isBefore: true,
    })).concat([{}]) : [{}]);
    let uploadIds = [].concat(defaultImages ? defaultImages.map(c => c.id) : [])
    return [list, uploadIds];
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired
  };

  componentWillMount() {
    if(typeof this.props.max == "number"){
      this.setState({
        max: this.props.max + 1,
      })
    }
    this.props.actions.getUploadTokenAction({
      isPrivate: false
    });
  }

  componentDidMount() {
    this.context.refs["_takePhoto"] = this;
    if(this.props.initWidth && this.props.initHeight){
      this.setState({
        previewImgWidth: this.props.initWidth,
        previewImgHeight: this.props.initHeight,
      })
      //console.warn('_takePhoto W', this.props.initWidth, this.props.initHeight)
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.defaultImages !== this.props.defaultImages) {
      const [list, uploadIds] = this.initImages(nextProps.defaultImages);
      this.setState({
        list: list,
        uploadIds: uploadIds
      })
    }
  }

  // "{"callback_url":"http://222.211.90.70:9999/api/sd/v1/attachment/qi_niu_callback/","callback_bodyType":"application/x-www-form-urlencoded","callback_body":"bucket=shandudata\u0026path_id=IMG_00031530858911303.JPG\u0026file_name=IMG_00031530858911303.JPG\u0026type=image%2Fjpeg\u0026size=6581432\u0026code=lgreFco_pKn9jmFZBaVSRtI2_7FY\u0026desc=%7B%22colorModel%22%3A%22ycbcr%22%2C%22format%22%3A%22jpeg%22%2C%22height%22%3A2002%2C%22orientation%22%3A%22Top-left%22%2C%22size%22%3A6.581432e%2B06%2C%22width%22%3A3000%7D\u0026owner_id=\u0026usage=","token":"","err_code":400,"error":"Bad Request","hash":"lgreFco_pKn9jmFZBaVSRtI2_7FY","key":"IMG_00031530858911303.JPG"}"

  // 上传图片
  async uploadPic() {
    let resultUploadIds = [];
    for (let i = 0; i < this.state.list.length - 1; i++) {
      const element = this.state.list[i];
      if (element.isBefore) {
        resultUploadIds.push(element.id);
        continue;
      }
      let data = new FormData();
      // let picName = element.name
      //   ? element.name.slice(0, element.name.lastIndexOf(".")) +
      //     new Date().getTime() +
      //     ".JPG"
      //   : new Date().getTime() + ".JPG";
      let picName = element.filename
        ? element.filename.slice(0, element.filename.lastIndexOf(".")) +
          new Date().getTime() +
          ".JPG"
        : new Date().getTime() + ".JPG";

      data.append("token", this.props.uploadToken);
      data.append("file", {
        uri: element.path,
        name: picName,
        type: "image/jpeg"
      });
      data.append("key", picName);

      data.append("x:userid", this.props.user.id);
      data.append("x:usage", "post");
      const result = await this.uploadItem(data);
      if (!result.error) {
        if (result.status == "ok") {
          resultUploadIds.push(result.id + "");
        }
      }
    }
    this.state.uploadIds = resultUploadIds;
    this.props.onUploaded && this.props.onUploaded(resultUploadIds);
    return resultUploadIds;
  }

  uploadItem(data) {
    return new Promise((reso, rej) => {
      this.props.actions.uploadFileAction(data, res => {
        reso(res);
      });
    });
  }

  getTakePhotoControll() {
    return this;
  }

  onPressDelete(i) {
    this.state.list.splice(i, 1);
    this.setState({
      list: [].concat(this.state.list)
    });
    //检测选中图片
    if(typeof this.props.hasImageAction == "function"){
      this.props.hasImageAction(this.state.list)
    }
  }
  pickerPhoto(index) {
    if (this.state.max - this.state.list.length <= 0) {
      Toast.info(`最多上传${this.state.max - 1}张图片`, 0.3);
      return;
    }
    switch (index) {
      case 0: // 打开相机
        ImagePicker.openCamera({
          // cropping: true,
          // cropperChooseText: "选择",
          // cropperCancelText: "取消",
          loadingLabelText: "获取中",
          // cropperToolbarTitle: "编辑图片",

        }).then(images => {
          let newList = [].concat(this.state.list);
          newList.pop();
          newList = newList.concat(images);
          newList.push({});
          this.setState({
            list: newList
          });
          //检测选中图片
          if(typeof this.props.hasImageAction == "function"){
            this.props.hasImageAction(newList)
          }
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: true,
          loadingLabelText: "获取中",
          maxFiles: this.state.max - this.state.list.length
        }).then(images => {
          let newList = [].concat(this.state.list);
          newList.pop();
          newList = newList.concat(images);
          newList.push({});
          this.setState({
            list: newList
          });
          //检测选中图片
          if(typeof this.props.hasImageAction == "function"){
            this.props.hasImageAction(newList)
          }
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {this.state.list.map((n, i) => {
          return (
            <PhotoItem
              onPressDelete={this.onPressDelete.bind(this, i)}
              getTakePhotoControll={this.getTakePhotoControll.bind(this)}
              key={i}
              // uri={n.uri ? n.uri : null}
              uri={n.path ? n.path : null}
              index={i}
              editable={typeof this.props.editable !== 'undefined' ? this.props.editable : true }
              max={this.state.max}
              imgW={this.state.previewImgWidth}
              imgH={this.state.previewImgHeight}
              dynamic={this.props.dynamic}
            />
          );
        })}

        <ActionSheet
          ref={o => (this.actionSheet = o)}
          title={"请选择打开图片方式"}
          options={["相机", "图库", "取消"]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.pickerPhoto.bind(this)}
        />
      </View>
    );
  }
}

class PhotoItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: { uri: this.props.uri },
      index: this.props.index,
      imgW: this.props.dynamic ? itemWidth : 150,
      imgH: this.props.dynamic ? itemWidth : 100,
    };
  }

  componentDidMount(){
    if(this.props.imgW && this.props.imgH){
      this.setState({
        imgW: this.props.imgW,
        imgH: this.props.imgH,
      })
      //console.warn('PhotoItem W', this.props.imgW, this.props.imgH)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.imgW !== this.props.imgW || nextProps.imgH !== this.props.imgH){
      this.setState({
        imgW: nextProps.imgW,
        imgH: nextProps.imgH,
      })
    }
    this.setState({
      avatarSource: {
        uri: nextProps.uri,
        index: nextProps.index
      }
    });
  }

  render() {
    return this.props.index >= (this.props.max - 1) ? null : (
      <View
        style={{
          width: this.state.imgW,
          height: this.state.imgH,
          // borderColor: "#ccc",
          // borderWidth: 1,
          alignItems: this.props.index == 0 && !this.state.avatarSource.uri ? 'flex-start' : 'center',
          justifyContent: 'center',
          marginBottom: CSS.pixel(20, true),
          marginRight: CSS.pixel(20)
        }}
      >
        {this.state.avatarSource.uri ? (
          <View
            style={{
              width: this.state.imgW,
              height: this.state.imgH,
              position: "relative"
            }}
          >
            <TouchableOpacity
              style={{ width: this.state.imgW, height: this.state.imgH }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: this.state.imgW,
                  height: this.state.imgH,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  onLoad={() => {
                    Toast.hide();
                  }}
                  source={this.state.avatarSource}
                  style={{ width: this.state.imgW, height: this.state.imgH }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            {
              this.props.editable ?
              <TouchableOpacity
                onPress={this.props.onPressDelete}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  position: "absolute",
                  right: 2,
                  top: 2
                }}
              >
                <Image source={require("@img/my/Post/mine_btn_delete.png")} />
              </TouchableOpacity> : null}
          </View>
        ) : (
          this.props.editable ?
          <TouchableOpacity
            style={{ width: CSS.pixel(100), height: CSS.pixel(100), borderRadius: CSS.pixel(50), borderWidth: 1, borderColor: '#DCDCDC'}}
            activeOpacity={0.8}
            onPress={() => {
              this.props.getTakePhotoControll().actionSheet.show();
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#ccc",
                  fontSize: 60,
                  fontWeight: '100',
                  top: -CSS.pixel(10, true)
                }}
              >
                +
              </Text>
            </View>
          </TouchableOpacity> : null
        )}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  uploadToken: state.uploadToken,
  user: getUserBaseInfo(state)
}))(SDTakePhoto);
