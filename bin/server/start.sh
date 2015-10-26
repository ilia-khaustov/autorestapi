#!/bin/sh

cd $root/src/server;
read -p "Host [localhost]: " host
read -p "HTTP port [8007]: " http_port
read -p "HTTPS port [4443]: " https_port

host=${host:-localhost};
http_port=${http_port:-8007};
https_port=${https_port:-4443};

nohup node . \
  --ssl_key="$root/share/server/ssl/$host.key" \
  --ssl_cert="$root/share/server/ssl/$host.cert" \
  --http_port="$http_port" \
  --https_port="$https_port" \
  --log_file="$root/share/server/server.log" \
  >> $root/share/server/server.stdout \
  2>> $root/share/server/server.stderr &
echo $! > "$root/share/server/process.pid";