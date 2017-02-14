FROM docker-repo:5000/huayun/base-image:ubuntu-14.04

# Install chinese
RUN apt-get update && apt-get -y install language-pack-zh-hans

ENV LC_ALL zh_CN.UTF-8

ENV PATH /usr/local/bin:$PATH
ENV LEIN_ROOT 1


# install core build tools
RUN apt-get update &&  apt-get install -y git wget make g++  ttf-dejavu 
#RUN apt-get install -y nodejs  npm

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.6.0

COPY node-v$NODE_VERSION-linux-x64.tar.gz /

RUN tar -xzf "/node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN npm install --registry=http://103.231.69.114:8081/repository/npm-central/ -g yarn && \
    ln -sf "${JAVA_HOME}/bin/"* "/usr/bin/"

RUN mkdir -p /root/.lein/self-installs/
COPY leiningen-2.7.1-standalone.zip /root/.lein/self-installs/leiningen-2.7.1-standalone.jar 

# install lein
ADD https://raw.github.com/technomancy/leiningen/stable/bin/lein /usr/local/bin/lein
RUN chmod 744 /usr/local/bin/lein

# add the application source to the image
RUN mkdir -p /root/.m2
ADD settings.xml /root/.m2
ADD . /app/source

# build the app
WORKDIR /app/source
RUN bin/build

# remove unnecessary packages & tidy up
#RUN apt-get remove -y nodejs git wget python make g++
RUN rm -rf /root/.lein /root/.m2 /root/.node-gyp /root/.npm /root/.yarn /root/.yarn-cache /tmp/* /var/cache/apk/* /app/source/node_modules /app/source/src

# expose our default runtime port
EXPOSE 3000

# build and then run it
WORKDIR /app/source
ENTRYPOINT ["./bin/start"]
