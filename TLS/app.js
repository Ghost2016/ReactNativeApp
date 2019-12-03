var http = require('http');
import express from 'express';
import config from 'config-lite';
import router from './router/index.js';
import cookieParser from 'cookie-parser';
import winston from 'winston';                  // 日志记录
import expressWinston from 'express-winston';   // api路由日志
import path from 'path';
import history from 'connect-history-api-fallback';
const bodyParser = require('body-parser');


const app = express();
let server = http.Server(app);

app.all('*', (req, res, next) => {

    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, SourceUrl");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", '3.2.1');

    if (req.method == 'OPTIONS') {
        
        res.send(200);
    } else {
        // console.log(req.headers)
        next();
    }
});

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'));

// post数据解析
app.use(bodyParser.json()); // for parsing application/json  
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// cookie解析
app.use(cookieParser());

// 打印请求成功日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ],
    colorize: true
}));

router(app);

// 打印请求失败日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ],
    colorize: true,
}));


app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

server.listen(config.port);