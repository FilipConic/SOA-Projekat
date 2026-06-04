#!/bin/bash

mkdir -p ./gateway/gen/
mkdir -p ./blog/gen/
mkdir -p ./tours/gen/
mkdir -p ./followers/demo/src/main/gen/

protoc -I proto \
  --go_out=$(pwd)/gateway/gen --go_opt=paths=source_relative \
  --go-grpc_out=$(pwd)/gateway/gen --go-grpc_opt=paths=source_relative \
  --grpc-gateway_out=$(pwd)/gateway/gen --grpc-gateway_opt=paths=source_relative \
  proto/common/user.proto \
  proto/blog/blog.proto \
  proto/followers/followers.proto \
  proto/purchase/purchase.proto \
  proto/tours/tours.proto

$(pwd)/blog/node_modules/.bin/grpc_tools_node_protoc \
  -I proto \
  --js_out=import_style=commonjs,binary:blog/gen \
  --grpc_out=grpc_mode=grpc-js:blog/gen \
  --plugin=protoc-gen-ts=$(pwd)/blog/node_modules/.bin/protoc-gen-ts \
  --ts_out=blog/gen \
  proto/google/api/annotations.proto \
  proto/google/api/http.proto \
  proto/common/user.proto \
  proto/blog/blog.proto

sed -i "s/require('grpc')/require('@grpc\/grpc-js')/g" blog/gen/blog/blog_grpc_pb.js

protoc -I proto \
  --go_out=tours/gen/ \
  --go_opt=paths=source_relative \
  --go_opt=Mcommon/user.proto=tours/gen/common \
  --go-grpc_out=tours/gen/ \
  --go-grpc_opt=paths=source_relative \
  --go-grpc_opt=Mcommon/user.proto=tours/gen/common \
  proto/common/user.proto \
  proto/tours/tours.proto

protoc -I proto \
  --java_out=followers/demo/src/main/gen \
  --plugin=protoc-gen-grpc-java=./protoc-gen-grpc-java-linux-x86_64 \
  --grpc-java_out=followers/demo/src/main/gen \
  proto/common/user.proto \
  proto/followers/followers.proto

