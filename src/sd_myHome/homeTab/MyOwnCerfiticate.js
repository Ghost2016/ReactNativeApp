import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator
} from "react-native";
import { CSS } from "../../common/SDCSS";
import SDCertificateItem from "../../common/SDCertificateItem";
import SDPullScrollView from "../../common/SDPullScrollView";
import connectWithActions from "../../connectWithActions";

class MyOwnCerfiticate extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      currentPage: 1,
      perPage: 10,
      count: 0,
      totalPage: 0,
      refreshState: 0
    };
  }

  componentDidMount() {
    this.props.actions
      .getCertificateAction({
        id: this.props.userId,
        size: this.state.perPage,
        page: this.state.currentPage
      })
      .then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            data: res.results,
            currentPage: res.current_page,
            perPage: res.per_page,
            count: res.count,
            totalPage: res.total_page,
            refreshState: res.total_page <= res.current_page ? 3 : 0
          });
        } else {
          this.setState({
            refreshState: 0
          });
        }
      })
      .catch(err => {});
  }

  renderItem(item, index) {
    return (
      <SDCertificateItem
        num={index}
        key={item.id + ""}
        score={item.score}
        title={item.certificate.name}
        time={item.acquire_date.replace(/-/g, ".")}
      />
    );
  }

  onHeaderRefresh() {
    this.setState({
      refreshState: 1
    })
    this.props.actions
      .getCertificateAction({
        id: this.props.userId
      })
      .then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            data: res.results,
            currentPage: res.current_page,
            perPage: res.per_page,
            count: res.count,
            totalPage: res.total_page,
            refreshState: res.total_page <= res.current_page ? 3 : 0
          });
        } else {
          this.setState({
            refreshState: 0
          })
        }
      })
      .catch(err => {});
  }

  onFooterRefresh() {
    if (this.state.currentPage < this.state.totalPage) {
      this.setState({
        refreshState: 2
      })
      this.props.actions
      .getCertificateAction({
        id: this.props.userId,
        page: this.state.currentPage + 1,
        size: this.state.perPage
      })
      .then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            data: this.state.data.concat(res.results),
            currentPage: res.current_page,
            perPage: res.per_page,
            count: res.count,
            totalPage: res.total_page,
            refreshState: res.total_page <= res.current_page ? 3: 0
          });
        } else {
          this.setState({
            refreshState: 0
          });
        }
        
      })
      .catch(err => {});
    }
  }

  render() {
    return (
      <SDPullScrollView
        style={{
          flex: 1
        }}
        refreshState={this.state.refreshState}
        onHeaderRefresh={this.onHeaderRefresh.bind(this)}
        onFooterRefresh={this.onFooterRefresh.bind(this)}
        data={this.state.data.filter(c => c.audit_status == 'audit_pass')}
        renderItem={this.renderItem.bind(this)}
      />
    );
  }
}

export default connectWithActions((state, props) => ({}))(MyOwnCerfiticate);
