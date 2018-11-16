var express = require('express');
var router = express.Router();
var nodeModel =require('../models/node');

router.post('/register', function(req, res, next) {
    let ip = req.body.ip;
    let netIp = req.body.netIp;
    let release = req.body.release;
    let nickname = req.body.nickname || '';
    let hostname = req.body.hostname;
    let group = req.body.group || '云服务器组';

    if(!ip || !release || !hostname){
        return res.send({code:404, msg:'params not found'});
    }

    nodeModel.add(hostname,ip,netIp,nickname,group,release).then( () => {
        return res.send({code:200, msg:'success'});
    }).catch( (err) => {
        console.error(err);
        return res.send({code:400, msg:'system error'});
    });
});

router.get('/list', function(req, res, next) {
    nodeModel.list().then( (data) => {
        return res.send({code:200, msg:'success',data:data});
    }).catch( (err) => {
        console.error(err);
        return res.send({code:400, msg:'system error'});
    });
});

module.exports = router;
