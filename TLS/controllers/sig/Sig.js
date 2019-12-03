'use strict';
import Base from '../../prototype/Base';
import config from 'config-lite';
var sig = require('tls-sig-api');

// 认证TLS签名
class Sig extends Base {
    constructor() {
        super();
        this.sig = new sig.Sig(config.sig);

        this.hash = this.hash.bind(this);        
    }
    async hash(req, res, next) {
        try {
            let appId = req.params.appid || req.query.appid || req.query.appId;
            return this.resSuc(res, {
                sig: this.sig.genSig(appId)
            });
        } catch (err) {
            return this.resInnerError(res, err);
        }
    }

}

export default new Sig();