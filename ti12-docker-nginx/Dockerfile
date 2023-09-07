FROM nginx:latest
EXPOSE 80
VOLUME /log
ADD nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d/default.conf