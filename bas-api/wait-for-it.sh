#!/bin/bash

# Tham số host và port
DOMAIN=$1

# Tách domain và port
IFS=':' read -r -a array <<< "$DOMAIN"
HOST=${array[0]}
PORT=${array[1]}

# Thời gian chờ trước khi kiểm tra lại
WAIT_TIME=5

# Hàm kiểm tra kết nối tới cổng
function check_tcp_port() {
  nc -z $HOST $PORT
  return $?
}

echo "Đang đợi ứng dụng sẵn sàng tại $DOMAIN..."

# Lặp lại cho đến khi kết nối thành công
while ! check_tcp_port; do
  echo "Cổng $PORT trên $HOST chưa sẵn sàng. Đợi $WAIT_TIME giây trước khi thử lại..."
  sleep $WAIT_TIME
done

echo "Ứng dụng đã sẵn sàng tại $DOMAIN"