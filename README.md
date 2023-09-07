# ti12-ar
For AR on TI12. 

一个小小的在线卡片制作及浏览网页。

请热爱DOTA以及AR粉丝写下对AR的祝福。

希望今年的TI12，中国队可以将冠军夺回来！希望超哥圆梦！

## ti12-ar-frontend
NEXTJS前端交互服务

## ti12-ar-cardmaker
NODEJS后端卡片制作服务

## ti12-docker-nginx
DOCKER NGINX构建目录

# 支持以下3种部署运行方式：

# 1-非容器运行
1. 安装并运行redis。注：代码中采用默认连接方式，可根据实际情况修改。
2. 安装并运行nginx。注：nginx用于代理卡片图片的访问。当前配置为：
```
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    server {
        listen 80;

        location / {
                proxy_pass http://localhost:3000;
        }

        location /ti12ar/ {
                #根据实际情况配置root
                root /your_host_card_image_path;
                autoindex on;
        }
    }
}
```
3. 安装nodejs环境。注：采用LTS版本即可。顺带安装yarn。
4. 编译并运行ti12-ar-frontend服务。注：此服务提供WEB前端界面以及前端接口，默认占用3000端口。
```
cd ti12-ar-frontend
npm install /OR yarn
npm run build /OR yarn build
npm run start /OR yarn start
```
5. 编译并运行ti12-ar-cardmaker服务。注：此服务初始化卡片图片存储，并侦听redis卡片制作消息。
```
cd ti12-ar-cardmaker
npm install /OR yarn
npm run start /OR yarn start
```
6. 浏览器打开localhost访问，Nginx会代理到3000端口。
7. 为了减轻服务器计算压力，会定期将卡片索引数据存储在浏览器localStorage，在查看卡片时由浏览器计算随机展示的图片索引，最终通过nginx直接访问图片URL。
# 2-独立Docker容器运行：
1. Nginx的容器化：
```
cd ti12-docker-nginx
sudo docker pull nginx
sudo docker build -t ti12-docker-nginx .
sudo docker run --name ti12-docker-nginx --net host -p 80:80 -v /your_host_card_image_path:/usr/ti12ar ti12-docker-nginx
```
2. Redis的容器化：
```
sudo docker pull redis
sudo docker run --name ti12-docker-redis --net host redis
```
3. ti12-ar-frontend的容器化： 
```
cd ti12-ar-frontend
sudo docker build -t ti12-ar-frontend .
sudo docker run --name ti12-ar-frontend -p 3000:3000 --net host ti12-ar-frontend
```
4. ti12-ar-cardmaker的容器化： 
```
cd ti12-ar-cardmaker
sudo docker build -t ti12-ar-cardmaker .
sudo docker run --name ti12-ar-cardmaker --net host -v /your_host_card_image_path:/root/ti12ar ti12-ar-cardmaker
```
# 3-Docker Compose运行：
此方式是步骤最少最傻瓜化的部署运行方式。
编辑compose.yaml文件，将里面volumes的source修改为实际宿主机目录
```
sudo docker compose up /独立compose则运行：sudo docker-compose up
```
需要停止整个服务时：
```
sudo docker compose down
```