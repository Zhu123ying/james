#! /bin/bash
DOCKER_BUILDPATH=/opt/haihe/docker/front

rm -rf $DOCKER_BUILDPATH
mkdir -p $DOCKER_BUILDPATH

npm install && npm run build

echo "current path: `pwd`"

mv dist $DOCKER_BUILDPATH
cp deploy/haihe.conf $DOCKER_BUILDPATH/haihe.conf
cp docker/Dockerfile $DOCKER_BUILDPATH/

ls -al $DOCKER_BUILDPATH