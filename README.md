# Monitor
Linux基本信息监控以及报警推送

# 1.服务器端采集程序
## 1.1功能简介
* 收集CPU,内存，硬盘的信息
* 设置预警值，超过预计值后发送邮件
* 每秒（可配置）实时推送

## 1.2运行
> python agent.py start

## 1.3停止
> python agent.py stop

## 1.4重启
> python agent.py.restart

# 2.服务器信息服务程序
## 2.1功能简介
* 提供接口，接收agent的数据存入数据库
* 提供接口，查询服务器列表以及对应的服务器信息
* 定期删除30分钟之前的荣誉日志

## 2.2 运行
> npm install

> pm2 start bin/www --name monitor
