FROM xuweijie1015/yapi:latest

COPY ./config.json /yapi
COPY ./ /yapi/vendors

ENV YAPI_ADMIN_ACCOUNT=admin@admin.com
ENV YAPI_ADMIN_PASSWORD=admin
ENV YAPI_CLOSE_REGISTER=true
ENV YAPI_DB_SERVERNAME=127.0.0.1
ENV YAPI_DB_PORT=27017
ENV YAPI_DB_DATABASE=yapi
ENV YAPI_MAIL_ENABLE=false
ENV YAPI_LDAP_LOGIN_ENABLE=false
ENV YAPI_PLUGINS='[{"name":"add-user","options":{}},{"name":"notifier","options":{"host":"http://localhost:3000"}},{"name":"pl-auto-test","options":{"host":"http://localhost:3000"}},{"name":"interface-oauth2-token"},{"name":"api-watch"}]'

RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories && \
  echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories && \
  apk add util-linux && \
  npm install pm2 -g && \
  apk add mongodb-tools && \
  mkdir -p /data/db/restore-data



EXPOSE $PORT

CMD mongod --fork --dbpath=/data/db/  --logpath=mongodb.log && node /yapi/vendors/start.js

