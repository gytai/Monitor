/**
 *Author: TaiGuangYin
 *Date: 2018
 *Description: 服务器信息
 */
const Sequelize = require('sequelize');
const sequelizeInstance = require('../utils/sequelize').sequelizeInstance;

const Model = sequelizeInstance.define('linux_node', {
    id:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hostname: {
        type: Sequelize.STRING(50),
        comment:'服务器名称'
    },
    ip: {
        type: Sequelize.STRING(50),
        comment:'服务器Ip'
    },
    netIp: {
        type: Sequelize.STRING(50),
        comment:'服务器公网Ip'
    },
    nickname: {
        type: Sequelize.STRING(50),
        comment:'服务器别名'
    },
    group: {
        type: Sequelize.STRING(50),
        comment:'服务器分组'
    },
    release: {
        type: Sequelize.STRING(100),
        comment:'服务器发行版本'
    }
},{
    freezeTableName: true,
    tableName:'linux_node',
    paranoid: false,
    timestamps: true,
    updatedAt:false
});

//生成数据表
Model.sync().then(() => {
    console.log('linux-report表生成成功')
}).catch(error => {
    console.error('linux-report生成失败',error);
});

function list() {
    return Model.findAll();
}

async function add(hostname,ip,netIp,nickname,group,release) {
    let info = await Model.findOne({
        where:{
            netIp:netIp
        }
    });

    if(info){
        return info;
    }

    return Model.create({
        hostname:hostname,
        ip:ip,
        netIp:netIp,
        nickname:nickname,
        group:group,
        release:release
    })
}


exports.add = add;
exports.list = list;
