
# wasm_simple_test

간단한 WebAssembly(WASM) 예제 프로젝트입니다. C++ 코드를 WebAssembly로 빌드하여 웹에서 실행하는 방법을 다룹니다.

## 요구 사항

- [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) 설치
- CMake
- Python 3

## 빌드 방법

1. 빌드 디렉토리 생성 및 이동
   ```sh
   mkdir build && cd build
   ```
2. CMake 프로젝트 생성 (Emscripten 툴체인 사용)
   ```sh
   emcmake cmake ..
   ```
3. 빌드 실행
   ```sh
   cmake --build .
   ```

## 실행 방법

1. public 디렉토리로 이동
   ```sh
   cd public
   ```
2. 간단한 웹서버 실행 (8080 포트)
   ```sh
   python3 -m http.server 8080
   ```
3. 브라우저에서 [http://localhost:8080](http://localhost:8080) 접속

## 파일 구조

- `hello_wasm.cpp` : C++ 예제 소스 코드
- `CMakeLists.txt` : CMake 빌드 설정 파일
- `public/` : 빌드된 WASM 및 웹 리소스 위치
- `build/` : CMake 빌드 디렉토리 (자동 생성)

## 참고

- Emscripten 설치 및 환경설정이 필요합니다. [공식 가이드](https://emscripten.org/docs/getting_started/downloads.html)를 참고하세요.