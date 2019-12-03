let Unit = {};
// 构造Get请求参数
Unit.paramData = (data, isAppend = true) => {
    if (data && typeof data === "object") {
        if (!data.userId) {
            data.userId = sessionStorage.getItem('userId')
        }
    } else {
        return "";
    }
    let paramArr = [];
    let paramStr = '';
    for (let attr in data) {
        paramArr.push(attr + '=' + data[attr]);
    }
    paramStr = paramArr.join('&');
    if (isAppend !== false) {
        paramStr = paramStr === '' ? paramStr : '?' + paramStr;
    }
    return paramStr
}

/**
 * 获取地址栏所有参数
 * @return {[type]} [description]
 */
Unit.getSearch = function () {
    var search = window.location.search;
    if (search) {
        var queryArr = search.split('?')[1].split('&');
        var q = {};
        for (var k in queryArr) {
            var qArr = queryArr[k].split('=');
            q[qArr[0]] = qArr[1];
        }
        return q;
    } else {
        return null;
    }
};

Unit.fixTime = function (t) {
    if (t < 0) {
        t = "00";
    } else if (t < 10) {
        t = "0" + t;
    }
    return t;
};

// 计算时间输出
Unit.ftime = function (time) { // time format 2016-11-11T18:56:33.904Z
    if(time == "" || time == null) {
        return "";
    }
    var datePart = time.substring(0, 10).replace(/\-/g, "/");;
    var timePart = time.substring(11, 19);
    //console.log(datePart + ' ' + timePart);
    var oldTime = (new Date(datePart + ' ' + timePart)).getTime();
    var currTime = new Date().getTime();
    var diffValue = currTime - oldTime;

    var days = Math.floor(diffValue / (24 * 3600 * 1000));
    if (days === 0) {
        //计算相差小时数
        var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours === 0) {
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);  //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes === 0) {
                //计算相差秒数
                var leave3 = leave2 % (60 * 1000);   //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);
                return seconds + '秒前';
            }
            return minutes + '分钟前';
        }
        return hours + '小时前';
    }

    // 如果大于了 7 天 则输出日期
    if (days > 7) {
        var datetime = new Date(time);
        var month = Unit.fixTime(datetime.getMonth() + 1);
        var day = Unit.fixTime(datetime.getDate());
        return datetime.getFullYear() + '-' + month + '-' + day;
    }
    return days + '天前';
}

/**
 * 从一个对象数组中通过对象的指定属性和值获取数组的元素
 * @memberof Unit
 * @method getElementByAttr
 * @param {Array} arr 数组，
 * @param {String} attrname 属性名称
 * @param {String} attrvalue 属性值
 * @return {Object|Boolean} 数组元素|false
 * @since 0.0.1
 * @Author: evilrule
 */
Unit.getElementByAttr = function (arr, attrname, attrvalue) {
        for (var i = 0, len = arr.length; i < len; i++) {
                if (!arr[i][attrname] || typeof arr[i][attrname] != "object")
                        if (arr[i][attrname] == attrvalue)
                                return arr[i];
        }
        return false;
};

/**
 * 获取对象所在索引位置
 * @memberof Unit
 * @method getElementByAttr
 * @param {Array} arr 数组，
 * @param {String} attrname 属性名称
 * @param {String} attrvalue 属性值
 * @return {Object|Boolean} 数组元素|false
 * @since 0.0.1
 */
Unit.getElementIndex = function (arr, attrname, attrvalue) {
        for (var i = 0, len = arr.length; i < len; i++) {
                if (!arr[i][attrname] || typeof arr[i][attrname] != "object")
                        if (arr[i][attrname] == attrvalue)
                                return i;
        }
        return false;
};
module.exports = Unit;