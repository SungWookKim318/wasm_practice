# wasm_practice

C++과 CMake를 사용하여 WASM 모듈을 생성하고, React와 Vite를 사용한 웹사이트에서 사용하는 프로젝트입니다.

## 프로젝트 구조

```
wasm_practice/
├── src/
│   └── helper.cpp          # C++ WASM 모듈 소스코드
├── web/                    # React Vite 프로젝트
│   ├── src/
│   │   ├── App.jsx        # 메인 React 컴포넌트
│   │   ├── App.css        # 스타일링
│   │   └── wasmLoader.js  # WASM 로더 유틸리티
│   └── public/            # 빌드된 WASM 파일이 위치할 디렉토리
├── CMakeLists.txt         # CMake 설정 파일
├── build-wasm.sh          # WASM 빌드 스크립트
└── README.md
```

## 기능

- ✅ React와 Vite를 사용해서 간단한 웹사이트를 구성
- ✅ 웹사이트에는 오른쪽에 하나의 버튼과 왼쪽에 캔버스가 위치함
- ✅ 버튼을 눌르면 helper.cpp의 함수를 WASM을 통해 불러서 임의의 RGB 값을 얻음
  - ✅ WASM을 사용하기 위해서 CMake를 사용해서 C++ 프로젝트를 구성
  - ✅ CMake를 모르는 사람을 위해서 shell 스크립트 작성
- ✅ 얻은 RGB 값을 통해서 캔버스의 배경화면 색상을 변경
- ✅ README.md 에 사용법과 내용 갱신

## 사전 요구사항

1. **Emscripten SDK**: WASM 컴파일을 위해 필요
   ```bash
   # Emscripten 설치 (macOS)
   brew install emscripten
   
   # 또는 공식 설치 방법
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ./emsdk_env.sh
   ```

2. **Node.js**: React 프로젝트 실행을 위해 필요
   ```bash
   # Node.js 설치 확인
   node --version
   npm --version
   ```

3. **CMake**: C++ 프로젝트 빌드를 위해 필요
   ```bash
   # CMake 설치 (macOS)
   brew install cmake
   ```

## 빌드 및 실행 방법

### 1. WASM 모듈 빌드

```bash
# 프로젝트 루트 디렉토리에서
./build-wasm.sh
```

이 스크립트는 다음을 수행합니다:
- `build` 디렉토리 생성
- Emscripten을 사용해 CMake 설정
- C++ 코드를 WASM으로 컴파일
- `web/public/helper.js`와 `web/public/helper.wasm` 파일 생성

### 2. React 개발 서버 실행

```bash
# web 디렉토리로 이동
cd web

# 개발 서버 시작
npm run dev
```

### 3. 웹사이트 접속

브라우저에서 `http://localhost:5173`에 접속하여 앱을 확인할 수 있습니다.

## 사용법

1. 웹페이지가 로드되면 왼쪽에 회색 캔버스와 오른쪽에 "랜덤 색상 변경" 버튼이 표시됩니다.
2. 버튼을 클릭하면 C++ WASM 모듈의 `getRandomRGB()` 함수가 호출됩니다.
3. 함수에서 반환된 임의의 RGB 값으로 캔버스 배경색이 변경됩니다.
4. 현재 RGB 값이 캔버스 아래에 표시됩니다.

## 주요 파일 설명

- **`src/helper.cpp`**: 임의의 RGB 값을 생성하는 C++ 함수들
- **`CMakeLists.txt`**: Emscripten으로 WASM 빌드를 위한 CMake 설정
- **`build-wasm.sh`**: CMake를 모르는 사용자를 위한 간편한 빌드 스크립트
- **`web/src/wasmLoader.js`**: WASM 모듈을 로드하고 함수를 호출하는 유틸리티
- **`web/src/App.jsx`**: 캔버스와 버튼이 있는 메인 React 컴포넌트

## 문제 해결

- **WASM 파일을 찾을 수 없음**: `build-wasm.sh`를 실행하여 WASM 파일을 먼저 빌드해주세요.
- **Emscripten 명령어를 찾을 수 없음**: Emscripten SDK가 제대로 설치되고 환경 변수가 설정되었는지 확인해주세요.
- **개발 서버 오류**: `web` 디렉토리에서 `npm install`로 의존성을 설치했는지 확인해주세요.