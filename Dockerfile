FROM docker-repo-local:5000/huayun/dpd/node-nginx:14

USER root

ENV BUILD_DIR /tmp/build
RUN mkdir -p $BUILD_DIR
WORKDIR $BUILD_DIR

COPY src $BUILD_DIR/src
COPY package.json $BUILD_DIR/package.json
COPY jsconfig.json $BUILD_DIR/jsconfig
COPY .eslintrc.js $BUILD_DIR/.eslintrc.js


#RUN npm install  --no-optional --registry=http://178.104.163.97:8081/repository/npm-group/ \
RUN npm install  --no-optional --registry=http://npm.huayun.org:7001/ \
  && npm run build \
  && pwd \
  && ls -l $BUILD_DIR/ \
  && ls -l $BUILD_DIR/dist \
  && rm -rf /usr/share/nginx/html \
  && ls -l /usr/share/nginx \
  && mv $BUILD_DIR/dist /usr/share/nginx/html \
  && rm -rf $BUILD_DIR

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# CMD sleep 50000
