#!/bin/bash

#deploy@222.211.90.66
#ssh deploy@118.24.57.60

USER=deploy
HOST=118.24.57.60
DIR=/home/deploy/gitlab/share.zhimekaimen.com/H5/www   # might sometimes be empty!

cp apple-app-site-association ./www
rsync -avz --rsh='ssh -p22' ./www/ ${USER}@${HOST}:${DIR}
echo "测试发布成功：https://share.zhimekaimen.com/"

