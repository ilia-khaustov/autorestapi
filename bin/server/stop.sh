#!/bin/sh

kill -TERM $(cat "$root/share/server/process.pid");
rm "$root/share/server/process.pid";