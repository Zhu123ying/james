FROM harbor.huayun.org/library/alpine:3.14_amd64

ARG DIST_PATH=/opt/haihe/tmp_front/application/

RUN mkdir -p $DIST_PATH

COPY dist $DIST_PATH

CMD ["cp", "-r", "/opt/haihe/tmp_front/application/*", "/opt/haihe/front/application/"]
