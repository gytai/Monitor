var express = require('express');
var router = express.Router();
var reportModel = require('../models/report');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'linux-report' });
});

router.post('/report', function(req, res, next) {
    let cpu = req.body.cpu;
    let mem = req.body.mem;
    let disk = req.body.disk;
    let ip = req.body.ip;
    let hostname = req.body.hostname;

    if(!ip || !hostname || !cpu || !mem || !disk){
        return res.send({code:404, msg:'params not found'});
    }

    if(typeof cpu == 'string'){
        cpu = JSON.parse(cpu);
    }
    if(typeof mem == 'string'){
        mem = JSON.parse(mem);
    }
    if(typeof disk == 'string'){
        disk = JSON.parse(disk);
    }

    reportModel.add(hostname,ip,cpu,mem,disk).then( () => {
        return res.send({code:200, msg:'success'});
    }).catch( (err) => {
        console.error(err);
        return res.send({code:400, msg:'system error'});
    });
});

router.get('/report', function(req, res, next) {
    let ip = req.query.ip;
    let page = req.query.page || 1;
    let size = req.query.size || 10;

    page = page - 0;
    size = size - 0;

    if(!ip){
        return res.send({code:404, msg:'params not found'});
    }

    reportModel.list(ip,page,size).then( (data) => {
        return res.send({code:200, msg:'success',data:data});
    }).catch( (err) => {
        console.error(err);
        return res.send({code:400, msg:'system error'});
    });
});

module.exports = router;
