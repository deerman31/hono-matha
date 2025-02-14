#!/bin/sh

# SSL証明書が存在しない場合のみ生成

if [ ! -f /etc/nginx/ssl/nginx.crt ]; then
    mkdir -p /etc/nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/nginx.key \
        -out /etc/nginx/ssl/nginx.crt \
        -subj "/C=JP/ST=Tokyo/L=Tokyo/O=MyOrganization/OU=MyUnit/CN=localhost"
fi