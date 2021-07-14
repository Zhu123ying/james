#! /bin/bash
DOCKER_BUILDPATH=/opt/haihe/docker/application-front

rm -rf $DOCKER_BUILDPATH
mkdir -p $DOCKER_BUILDPATH

npm install --registry=http://npm.huayun.org:7001 --cache-min Infinity && npm run build

echo "current path: `pwd`"

mv build $DOCKER_BUILDPATH
cp docker/* $DOCKER_BUILDPATH/

ls -al $DOCKER_BUILDPATH
