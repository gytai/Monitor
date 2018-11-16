/**
 *Author: TaiGuangYin
 *Date: 2018
 *Description: 服务器信息
 */
const Sequelize = require('sequelize');
const sequelizeInstance = require('../utils/sequelize').sequelizeInstance;

const Model = sequelizeInstance.define('linux_report', {
    id:  {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ip: {
        type: Sequelize.STRING(20),
        comment:'服务器Ip'
    },
    mem_total: {
        type: Sequelize.STRING(15),
        comment:'内存总值'
    },
    mem_free: {
        type: Sequelize.STRING(15),
        comment:'内存剩余'
    },
    mem_percent: {
        type: Sequelize.STRING(15),
        comment:'内存百分比'
    },
    disk_total: {
        type: Sequelize.STRING(15),
        comment:'硬盘总值'
    },
    disk_free: {
        type: Sequelize.STRING(15),
        comment:'硬盘剩余'
    },
    disk_percent: {
        type: Sequelize.STRING(15),
        comment:'硬盘百分比'
    },
    cpu_total: {
        type: Sequelize.STRING(15),
        comment:'CPU剩余'
    },
    cpu_percent: {
        type: Sequelize.STRING(15),
        comment:'CPU百分比'
    },
},{
    freezeTableName: true,
    tableName:'linux_report',
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

function list(ip,page,size) {
    let offset = (page - 1) * size;
    return Model.findAll({
        where:{
            ip:ip
        },
        offset:offset,
        limit:size,
        order:[['created_at','desc']]
    });
}

function add(ip,cpu,mem,disk) {
    return Model.create({
        ip:ip,
        cpu_total:cpu[0],
        cpu_percent:cpu[1],
        mem_total:mem[0],
        mem_free:mem[1],
        mem_percent:mem[2],
        disk_total:disk[0],
        disk_free:disk[1],
        disk_percent:disk[2]
    })
}


exports.add = add;
exports.list = list;
