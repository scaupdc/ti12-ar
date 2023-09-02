# ti12-ar
For AR on TI12. 

希望今年的TI，中国队可以将冠军夺回来！希望超哥圆梦！

## ti12-ar-frontend
NEXTJS前端交互服务

## ti12-ar-cardmaker
NODEJS后端卡片制作服务

# 如何运行
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
                root /home/fire;
                autoindex on;
        }
    }
}
```
3. 安装nodejs环境。注：采用LTS版本即可。
4. 编译并运行ti12-ar-frontend服务。注：此服务提供WEB前端界面以及前端接口，默认占用3000端口。
```
cd ti12-ar-frontend
npm install
npm run build
npm run start
```
5. 编译并运行ti12-ar-cardmaker服务。注：此服务初始化卡片图片存储，并侦听redis卡片制作消息。
```
cd ti12-ar-cardmaker
npm install
node index.js
```
6. 浏览器打开localhost:3000
7. 为了减轻服务器计算压力，会定期将卡片索引数据存储在浏览器localStorage，在查看卡片时由浏览器计算随机展示的图片索引，最终通过nginx直接访问图片URL。