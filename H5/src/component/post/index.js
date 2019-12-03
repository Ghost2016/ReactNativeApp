import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { action } from "../../redux/action/index.js";
import "./index.less";

class PostBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsData: null
    };
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  componentDidMount() {
    if (
      !this.context.router ||
      !this.context.router.location ||
      JSON.stringify(this.context.router.location.query) === "{}"
    ) {
      return null;
    }
    const { newsid } = this.context.router.location.query;
    if (newsid) {
      this.props.getNewsDetailAction(newsid, res => {
        if (res.status == "ok") {
          this.setState({
            newsData: res.results
          });
        }
      });
    }
  }
  render() {
    if (
      !this.context.router ||
      !this.context.router.location ||
      JSON.stringify(this.context.router.location.query) === "{}" ||
      this.state.newsData == null
    ) {
      return <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, background: '#fff',width:'100%',height:'100%',zIndex: 5,}}></div>;
    }
    return (
      <div className="postbody">
        <div className="post-title">{this.state.newsData.title}</div>
        <div className="post-time">
          {this.state.newsData.created_time.slice(0, 10) +
            " " +
            this.state.newsData.created_time.slice(11, 16)}
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{
            __html: this.state.newsData.content_html //.replace(/[\n]/gi, "<br>")
          }}
        />
        {this.props.noTag ? null : <div className="post-label">
          {this.state.newsData.tags
            ? this.state.newsData.tags.map(item => {
                return (
                  <div key={item.id + ""} className="item">
                    {item.name}
                  </div>
                );
              })
            : null}
        </div>}
      </div>
    );
  }
}
const maptodispatchaction = dispatch => ({
  getNewsDetailAction: (id, success) => {
    dispatch(action.getNewsDetail(id, success));
  }
});

export default connect(
  null,
  maptodispatchaction
)(PostBody);
