#!/bin/sh

mkdir -p $root/share/server/ssl;
read -p "Host for SSL certificate [localhost]: " sslhost
sslhost=${sslhost:-localhost};
cd $root/src/server;

openssl req \
  -new \
  -newkey rsa:4096 \
  -days 365 \
  -nodes \
  -x509 \
  -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=$sslhost" \
  -keyout "$root/share/server/ssl/$sslhost.key" \
  -out "$root/share/server/ssl/$sslhost.cert"