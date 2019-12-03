/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { Toast } from "antd-mobile";
import { ActionSheet } from "antd-mobile";
import { navLightBox } from "../../styles";
import ShareButton from "../../sd_shareButton/ShareButton";
import SDTouchOpacity from "../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#e1e1e1",
    width: "100%"
  },
  bottomBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

class TabsButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasFav: this.props.hasFav ? this.props.hasFav : false,
      likeNum: this.props.likeNum,
      useNum: this.props.useNum,
      hasUse: this.props.hasUse ? this.props.hasUse : false
    };
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  componentWillReceiveProps(next) {
    this.setState({
      likeNum: next.likeNum,
      useNum: next.useNum,
      hasFav: next.hasFav,
      hasUse: next.hasUse ? next.hasUse : false
    });
  }

  addToFav() {
    if (!this.state.hasFav) {
      this.props.actions.addToFavAction(
        {
          id: this.props.id
        },
        res => {
          if (res.status === "ok") {
            Toast.info("收藏成功！", 0.2);
            this.setState({
              hasFav: true,
              likeNum: this.state.likeNum + 1
            });
          } else {
            Toast.fail("收藏失败！");
          }
          this.context.refs["_growScreen"] && this.context.refs["_growScreen"].refreshNewsData &&
          this.context.refs["_growScreen"].refreshNewsData();
        }
      );
    } else {
      // 进行取消收藏
      this.props.actions.addToFavAction(
        {
          id: this.props.id
        },
        res => {
          Toast.info("取消成功！", 0.2);
          this.setState({
            hasFav: false,
            likeNum: this.state.likeNum - 1
          });
          this.context.refs["_growScreen"] && this.context.refs["_growScreen"].refreshNewsData &&
          this.context.refs["_growScreen"].refreshNewsData();
        }
      );

      // 判断是否是在收藏页进行取消的
      // if (this.context.refs["g_collectTab"]) {
      //   // delete this.context.refs["g_collectTab"];
      //   this.context.refs["g_collectTab"].state.collectInfoData.splice(
      //     this.context.refs["g_collectTab"].state.collectInfoData.findIndex(
      //       c => c.id == this.props.id
      //     ),
      //     1
      //   );
      //   this.context.refs["g_collectTab"].setState({
      //     collectInfoData: [].concat(
      //       this.context.refs["g_collectTab"].state.collectInfoData
      //     )
      //   });
      // }

      // Toast.info("你已经收藏过啦！");
    }

  }

  addToUse() {
    if (!this.state.hasUse) {
      this.props.actions.toggleNewsUseAction(
        {
          id: this.props.id
        },
        res => {
          // Toast.info("点赞成功");
          this.setState({
            hasUse: true,
            useNum: this.state.useNum + 1
          });

          // 同步点赞数量
          try {
            if (this.context.refs["_studentShare_"+this.props.categoryId]) {
              let tempList = [];
              let currNum = 0;
              for (let i = 0; i < this.context.refs["_studentShare_"+this.props.categoryId].state.newsList.length; i++) {
                let element = Object.assign({}, this.context.refs["_studentShare_"+this.props.categoryId].state.newsList[i]);
                if (element.id == this.props.id) {
                  currNum = element.use_num = element.use_num + 1;
                }
                tempList.push(element);
              }
              this.context.refs["_studentShare_"+this.props.categoryId].setState({
                newsList: [].concat(
                  tempList
                ),
                detail: Object.assign({}, this.context.refs["_studentShare_"+this.props.categoryId].state.detail, {
                  is_used: true,
                  use_num: currNum
                })
              });
            }

            this.context.refs["_growScreen"] && this.context.refs["_growScreen"].refreshNewsData &&
            this.context.refs["_growScreen"].refreshNewsData();
          } catch (error) {
            // console.warn(error);
          }
        }
      );
    } else {
      // 进行取消收藏
      this.props.actions.toggleNewsUseAction(
        {
          id: this.props.id
        },
        res => {
          // Toast.info("取消成功！");
          this.setState({
            hasUse: false,
            useNum: this.state.useNum - 1
          });

          try {
            // 同步点赞数量
            if (this.context.refs["_studentShare_"+this.props.categoryId]) {
              let tempList = [];
              let currNum = 0;
              for (let i = 0; i < this.context.refs["_studentShare_"+this.props.categoryId].state.newsList.length; i++) {
                let element = Object.assign({}, this.context.refs["_studentShare_"+this.props.categoryId].state.newsList[i]);
                if (element.id == this.props.id) {
                  currNum = element.use_num = element.use_num - 1;
                }
                tempList.push(element);
              }
              this.context.refs["_studentShare_"+this.props.categoryId].setState({
                newsList: [].concat(
                  tempList
                ),
                detail: Object.assign({}, this.context.refs["_studentShare_"+this.props.categoryId].state.detail, {
                  is_used: false,
                  use_num: currNum
                })
              });
            }

            this.context.refs["_growScreen"] && this.context.refs["_growScreen"].refreshNewsData &&
            this.context.refs["_growScreen"].refreshNewsData();

            // 可能后面会刷新主页的
          } catch (error) {
            // console.warn(error);
          }
        }
      );
    }
  }

  render() {
    const _style = this.props.style || {};
    return (
      <View style={[styles.container, { ..._style }]}>
        <View style={styles.bottomBtn}>
          <SDTouchOpacity
            noDelay
            style={[
              styles.bottomBtn,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }
            ]}
            onPress={this.addToUse.bind(this)}
          >
            {this.state.hasUse ? (
              <Image source={require("@img/home/growing_ico_good_sel.png")} />
            ) : (
              <Image source={require("@img/home/growing_ico_good.png")} />
            )}
            <View style={{ marginLeft: 4 }}>
              <Text style={{ fontSize: 16, color: "#333" }}>
                有用(
                {this.state.useNum})
              </Text>
            </View>
          </SDTouchOpacity>
        </View>

        <View style={styles.bottomBtn}>
          <SDTouchOpacity
            noDelay
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={this.addToFav.bind(this)}
          >
            <View>
              {this.state.hasFav ? (
                <Image
                  source={require("@img/home/home_ico_Collection_sel.png")}
                />
              ) : (
                <Image
                  source={require("@img/home/home_ico_Collection_nor.png")}
                />
              )}
            </View>
            <View style={{ marginLeft: 4 }}>
              <Text style={{ fontSize: 16, color: "#333" }}>
                收藏(
                {this.state.likeNum})
              </Text>
            </View>
          </SDTouchOpacity>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(TabsButton);
