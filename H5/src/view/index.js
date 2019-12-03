import "babel-polyfill";
import { polyfill } from "es6-promise";
polyfill();
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import route from '../router/router.js';   //路由配置
import configure from '../redux/store/store.js';   // store配置
import myhistory from '../history/history.js';
import 'antd/dist/antd.less';
import "./customize-theme.less";

configure({ config: global.$GLOBALCONFIG });
const history = syncHistoryWithStore(myhistory, store);
history.listen(function (location) { return location });

ReactDOM.render(
    <Provider store={store}>
        <Router history={history} >
            {route(store)}
        </Router>
    </Provider>,
    document.querySelector('#app')
);

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function() {
        ReactDOM.render(
            <Provider store={store}>
                <Router history={history} >
                    {route(store)}
                </Router>
            </Provider>,
            document.querySelector('#app')
        );
    });
}
