#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
@author:taiguangyin
@time: 2018/11/15
@desc: 采集Linux 基本信息
"""

import psutil
import os,time,json
import sys
import sched
import urllib,urllib2
import smtplib
from email.header import Header
from email.mime.text import MIMEText
import socket

from daemon import Daemon

SCHED_TIME = 1 # 单位，秒
SERVER_URL = "http://localhost:3000"

MEM_WARN_LINE = 85
CPU_WARN_LINE = 90
DISK_WARN_LINE = 90

EMAIL_ACCOUNT = "you email account"
EMAIL_PASSWORD = "you email password"

MSG_RECEIVE_LIST = ["test1@qq.com","test2@qq.com"]

def getMem():
    data = psutil.virtual_memory()
    total = data.total
    free = data.available
    percent = data.percent
    return [total,free,percent]


def getCpu():
    data = psutil.cpu_percent(interval=1)
    count = psutil.cpu_count()
    return [count,data]

def getDisk():
    data = psutil.disk_usage('/')
    total = data.total
    free = data.free
    percent = data.percent
    return [total,free,percent]

def httpPost(url, data):
    req = urllib2.Request(url)
    data = urllib.urlencode(data)
    # enable cookie
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())
    response = opener.open(req, data)
    return response.read()

def getIp():
    # 获取本机计算机名称
    hostname = socket.gethostname()
    # 获取本机ip
    ip = socket.gethostbyname(hostname)
    return hostname,ip

def sendMail(content):
    hostname,ip = getIp()
    subject = '[Meyer服务器监控]%s(%s)服务器监控预警' % (hostname,ip)
    username = EMAIL_ACCOUNT
    password = EMAIL_PASSWORD
    smtp_server = 'smtp.126.com'
    header = '您好！<br/> %s(%s)服务器性能预警<br/>' % (hostname,ip)
    footer = '</br>--------------------------------------------------------<br/>此为系统邮件请勿回复'
    content = '%s<br/>%s<br/>%s' % (header, content, footer)

    msg = MIMEText(content, 'html', 'utf-8')  # 中文需参数‘utf-8'，单字节字符不需要
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = EMAIL_ACCOUNT
    msg_to_list = MSG_RECEIVE_LIST  # 多个收信人
    smtp = smtplib.SMTP()
    smtp.connect(smtp_server)
    smtp.login(username, password)
    smtp.sendmail(msg['From'], msg_to_list, msg.as_string())
    smtp.quit()


def checkStatus():
    mem = getMem()
    cpu = getCpu()
    disk = getDisk()
    memStr = "Memory Total:%dM Free:%dM usage:%d" % (mem[0] / 1024 / 1024, mem[1] / 1024 / 1024, int(round(mem[2]))) + '%'
    diskStr = "Disk Total:%dG Free:%dG usage:%d" % (disk[0] / 1024 / 1024 / 1024, disk[1] / 1024 / 1024 / 1024, int(round(disk[2]))) + '%'
    cpuStr = "CPU count:%d usage:%0.2f" % (cpu[0], cpu[1]) + '%'
    print(cpuStr,memStr,diskStr)
    data = {'mem':mem,'cpu':cpu,'disk':disk}
    resp = httpPost(SERVER_URL + '/api/report',data)
    print('http result:',resp)
    if mem[2] >= MEM_WARN_LINE or disk[2] >= DISK_WARN_LINE or cpu[1] >= CPU_WARN_LINE:
        sendMail(cpuStr + "<br/>" +memStr + "<br/>" + diskStr)
    schedule.enter(SCHED_TIME, 0, checkStatus, ())

class taskDaemon(Daemon):
    def run(self):
        sys.stdout.write('[info]{%s} Daemon started with pid {%s}\n' % (time.ctime(), os.getpid()))
        sys.stdout.flush()
        schedule.enter(SCHED_TIME, 0, checkStatus, ())
        schedule.run()

if __name__ == '__main__':
    schedule = sched.scheduler(time.time, time.sleep)
    PIDFILE = '/tmp/daemon-sysinfo.pid'
    LOG = '/tmp/daemon-sysinfo.log'
    daemon = taskDaemon(pidfile=PIDFILE, stdout=LOG, stderr=LOG)
    if len(sys.argv) != 2:
        print('Usage: {} [start|stop]'.format(sys.argv[0]))
        raise SystemExit(1)
    if 'start' == sys.argv[1]:
        daemon.start()
    elif 'stop' == sys.argv[1]:
        daemon.stop()
    elif 'restart' == sys.argv[1]:
        daemon.restart()
    else:
        print('Unknown command {!r}'.format(sys.argv[1]))
        raise SystemExit(1)