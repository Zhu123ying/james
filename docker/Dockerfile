ARG repo
FROM ${repo:-10.192.13.66}/library/nginx:1.16.1.front5

EXPOSE 11001

ARG DIST_PATH=/opt/haihe/front/dist/

RUN mkdir -p $DIST_PATH
COPY dist $DIST_PATH

CMD nginx -g "daemon off;"