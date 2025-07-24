#!/bin/bash

# WASM 빌드 스크립트
# Emscripten이 설치되어 있어야 합니다.

echo "Building C++ to WASM..."

# 빌드 디렉토리 생성
if [ ! -d "build" ]; then
    mkdir build
fi

cd build

# Emscripten CMake 사용
emcmake cmake ..

# 빌드 실행
emmake make

echo "WASM build completed!"
echo "Generated files:"
echo "- web/public/WASMRenderer.js"
echo "- web/public/WASMRenderer.wasm"

cd ..
