import fetch from 'isomorphic-fetch';
import Api from '../../config/apiurl';
// import $ from 'jquery';
import { openNotificationWithIcon } from '../../libs/func'

export const getNewsDetail = (id, success) => {
    var path = Api.News.getNewsDetail(id);
    return dispatch => {
        // return $.ajax({
        //     url: path,
        //     type: 'GET',
        //     contentType: 'application/json',
        //     dataType: 'json',
        //     success: function(res) {
        //         success && success instanceof Function && success(res)
        //     }
        // })
        return fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors"
        })
            .then(response => response.json())
            .then(json => success && success instanceof Function && success(json))
            .catch(error => {
                console.warn("fetch error", error)
                openNotificationWithIcon('error', '请求失败！', "")
                return error
            })
    }
}

export const resgister = (param, success) => {
    var path = Api.News.register();
    return dispatch => {
        return fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(param),
        })
            .then(response => response.json())
            .then(json => success && success instanceof Function && success(json))
            .catch(error => {
                console.warn("fetch error", error)
                openNotificationWithIcon('error', '请求失败！', "")
                return error
            })
    }
}

export const signupCode = (param, success) => {
    var path = Api.News.code();
    return dispatch => {
        return fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(param),
        })
            .then(response => response.json())
            .then(json => success && success instanceof Function && success(json))
            .catch(error => {
                console.warn("fetch error", error)
                openNotificationWithIcon('error', '请求失败！', "")
                return error
            })
    }
}

export const suanxinzi = (param, success, failed) => {
    var path = Api.News.salary(param);
    return dispatch => {
        return fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
        })
            .then(response => response.json())
            .then(json => success && success instanceof Function && success(json))
            .catch(error => {
                console.warn("fetch error", error)
                openNotificationWithIcon('error', '请求失败！', "")
                failed && failed instanceof Function && failed(error)
                return error
            })
    }
}

export const getWxJsSignature = (url, success) => {
    var path = Api.News.wxJsSignature(url);
    return dispatch => {
        return fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
        })
            .then(response => response.json())
            .then(json => success && success instanceof Function && success(json))
            .catch(error => {
                console.warn("fetch error", error)
                openNotificationWithIcon('error', '请求失败！', "")
                return error
            })
    }
}
