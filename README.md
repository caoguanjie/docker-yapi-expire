# YApi  可视化接口管理平台

 源码来源 [yapi官方github](https://github.com/ymfe/yapi)仓库，并基于`xwj-vic/yapi`最新版修复众多bug，基本实现拿来即用

所有问题看[这里](https://blog.opendeveloper.cn/yapi)就可以解决了


当前集成插件：(在config.json中添加进去即可使用)
- yapi-plugin-add-user
- yapi-plugin-api-watch
- yapi-plugin-export-schema
- yapi-plugin-import-swagger-customize
- yapi-plugin-interface-oauth2-token
- yapi-plugin-notifier
- yapi-plugin-pl-auto-test
- yapi-plugin-qsso
- yapi-plugin-webhook

## doker Hub镜像

为了更方便使用，博主已经构造好了一个镜像，开箱即用 链接：[docker hub](https://hub.docker.com/r/caoguanjie/docker-yapi)

镜像使用的可通过docker-compose的方式构建

```yml
version: '3'

services:
  yapi-web:
    image: caoguanjie/docker-yapi:latest
    container_name: yapi-web
    ports:
      - 40001:3000
    environment:
      - YAPI_ADMIN_ACCOUNT=admin@admin.com
      - YAPI_ADMIN_PASSWORD=admin
      - YAPI_CLOSE_REGISTER=true
      - YAPI_DB_SERVERNAME=127.0.0.1
      - YAPI_DB_PORT=27017
      - YAPI_DB_DATABASE=yapi
      - YAPI_MAIL_ENABLE=true
      - YAPI_MAIL_HOST=smtp.qq.com
      - YAPI_MAIL_PORT=465
      - YAPI_MAIL_FROM=
      - YAPI_MAIL_AUTH_USER=
      - YAPI_MAIL_AUTH_PASS=
      - YAPI_PLUGINS=[{"name":"add-user","options":{}},{"name":"notifier","options":{"host":"http://localhost:3000"}},{"name":"pl-auto-test","options":{"host":"http://localhost:3000"}},{"name":"interface-oauth2-token"},{"name":"api-watch"}]
    volumes:
     - ./data/db:/data/db
    restart: unless-stopped

```

## 二次开发

### mac环境搭建

硬性要求：以下版本一定要低，否则无法编译成功
-  本地node版本：v8.17.0
-  本地npm版本：v6.13.4
-  本地node-gyp版本：v9.3.1
-  本地python环境：2.7.18


### 部署客户端界面

如果需要调整界面或者改变yapi的代码，调整完代码之后，要执行命令之后，才会显示新的代码
```sh
# 打包yapi的客户端
npm run build-client
```
打包好的文件存放在路径：`static`文件夹里面，我们可以选择把`static`文件夹通过docker的复制命令`docker cp`把改变后的界面代码，复制到容器里面

也可以选择通过Dockerfile的文件，生成新的镜像，然后把镜像上传到docker Hub平台，然后再重启docker-compose命令，更新服务。
```sh
# 通过Dockerfile的文件构建镜像，要进入根目录  
docker build -t caoguanjie/docker-yapi:latest .
# 把镜像提交到docker Hub平台
docker push caoguanjie/docker-yapi:latest
# 去到相应的文件夹，执行docker-compose命令更新服务，记得要修改镜像的版本
docker-compose up
```

## 安装新插件

1. 插件主要依赖`/yapi/config.json`文件，把相应的插件下载到node_mudules之后，修改config.json文件即可。
2. 由于我该项目只保留的`/vendors`文件夹里面的代码，所以我把config.json的文件也放根目录地下了，因此我修改了`ykit.config.js`文件中的`initPlugins`方法，改了config.json的路径

## 数据备份
1. 先编写shell脚本进行数据库的备份操作
```sh
# 路径： mongo-backup.sh
# -h 连接的数据库地址， -d 数据库名称，-o 导出路径， -u 用户名， -p 密码
mongodump -h 127.0.0.1:27017 -d yapi -o /data/db/backup 


# 把数据库文件打包,压缩包的名字类似：yapi_2023-08-23.tar.gz
tar -zcvf  /data/db/backup/yapi_$(date +%F).tar.gz /data/db/backup/yapi

# 删除目录
rm -rf /data/db/backup/yapi
```

2. 设置定时任务。
```sh
# 进到容器的终端中，输入crontab -e 
# 设置定时任务，执行下面的命令会进去一个配置文件中去
crontab -e 
# 进到配置文件后，键盘输入： i，进行修改
# 加上一条定时任务
# 可以去菜鸟教程查看crontab命令：https://www.runoob.com/w3cnote/linux-crontab-tasks.html

# 定义每周六进行数据库备份
*   *   *   *   6   sh /yapi/vendors/mongo-backup.sh

# 进行上面操作后，键盘输入 esc + :wq(退出并保存)
# ！！！！！注意保存前，一定要删除容器中其他的定时任务，防止占用资源

# cron服务是Linux的内置服务，但它不会开机自动启动。可以用以下命令启动和停止服务
# crond start（启动）、crond stop(停止)、crond restart(重启服务)、crond reload(重新加载)
# 因此我们可以输入下面命令，进行定时器的启动
crond start
```


## 数据还原
docker镜像将会在路径`/data/db/`下创建一个`restore-data`的文件夹，存放yapi的备份数据，因此备份路径的具体文件夹是：`/data/db/restore-data/yapi`,执行MongoDB的恢复数据的工具`mongorestore`

```sh
## 命令结构是：>mongorestore -h <hostname><:port> -d dbname <path>
$ mongorestore -h 127.0.0.1:27017 -d yapi /data/db/restore-data/yapi
## [-h] MongDB所在服务器地址，例如：127.0.0.1或localhost，当然也可以指定端口号：127.0.0.1:27017
## [-D / -d] 需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如yapi
## [path] mongorestore 最后的一个参数，设置备份数据所在位置，这个备份数据，就是上面备份生成的备份数据文件夹，例如:D:\MongoDB\Server\4.2\data\yapi
```

如果在容器挂载的数据卷`/data/db/`中找不到文件夹restore-data，可以选择在宿主机中自行创建，创建完成会同步在docker容器中进行同步


我们可以进到yapi正在运行的容器中，打开容器中的终端命令界面，然后输入以下命令即可完成数据的恢复
```sh
sh /yapi/vendors/mongorestore.sh
```


## 踩坑记录

如果重新安装，出现如下错误，请删除管理员账号信息
```
(node:20024) UnhandledPromiseRejectionWarning: Error: 初始化管理员账号 "admin@admin.com" 失败, E11000 duplicate key error collection: yapi.user index: email_1 dup key: { : "admin@admin.com" }
```
进入数据库删除管理员账户信息
```sh
mongo

> use yapi;

> db.user.remove({"username":"admin"})
```