#!/bin/bash

USER=user
HOST=xxx.xxx.xxx.xxx
DIR=/nginx/html/app/ElephantApp/   # might sometimes be empty!

rsync -avz --rsh='ssh -p22' ./ElephantApp/ ${USER}@${HOST}:${DIR}
echo "测试发布成功：https://www.shandudata.com/app/ElephantApp/index.html"

