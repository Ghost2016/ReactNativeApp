'use strict';

import fetch from 'node-fetch';
import Unit from '../unit/unit';

export default class Base {
    // 请求数据接口
    async fetch(url = '', data = {}, type = 'GET', resType = 'JSON') {
        // 转为大写
        type = type.toUpperCase();
        resType = resType.toUpperCase();

        if (type === 'GET') {
            url = url + Unit.paramData(data);
        }

        // 默认请求参数
        let requestConfig = {
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }

        if (type === 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            });
        }

        let responseJson;
        try {
            const response = await fetch(url, requestConfig);
            if (resType === 'TEXT') {
                responseJson = await response.text();
            } else {
                responseJson = await response.json();
            }
        } catch (err) {
            console.log('获取http数据失败', err);
            throw new Error(err)
        }
        return responseJson;
    }

    // 将body key=value 格式转为为json对象
    bodyToJson(queryArr) {
        // console.log(queryArr);
        var queryArr = queryArr.split('&');
        var q = {};
        for (var k in queryArr) {
            var qArr = queryArr[k].split('=');
            q[qArr[0]] = qArr[1];
        }
        return q;
    }

    // 生成guid随机字符串
    randomString(flag = '-') {
        // 重新生成guid
        var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return str.replace(/-/g, flag);
    }

    // 增加查询到url上
    addQueryParamsToUrl(url, data) {
        if (url.indexOf('?') > 0) {
            for(var key in data) {
                url = url + '&' + key + '=' + data[key];
            }
        } else {
            url += '?';
            var i = 0;
            for(var key in data) {
                if (i == 0) {
                    url = url + key + '=' + data[key];
                    i++
                } else {
                    url = url + '&' + key + '=' + data[key];
                }
            }
        }
        return encodeURI(url);
    }

    // 回复成功请求
    resSuc(res, data) {
        return res.status(200).send({
            success: true,
            status: 'ok',
            code: 200,
            results: data
        });
    }

    // 回复请求出错信息
    resError(res, error) {
        return res.status(400).send({
            success: false,
            status: 'error',
            code: 400,
            message: '请求出错:' + (typeof error === 'string' ? error: JSON.stringify(error))
        });
    }

    // 回复服务器出错信息
    resInnerError(res, error) {
        return res.status(500).send({
            success: false,
            status: 'error',
            code: 500,
            message: '内部出错:' + (typeof error === 'string' ? error: JSON.stringify(error))
        });
    }

}
