# wasm_practice

C++과 CMake를 사용하여 WASM 모듈을 생성하고, React와 Vite를 사용한 웹사이트에서 사용하는 프로젝트입니다.

## 프로젝트 구조

```
wasm_practice/
├── src/
│   ├── WASMRenderer.h      # WASMRenderer 클래스 헤더 파일
│   └── WASMRenderer.cpp    # WASMRenderer 클래스 구현 파일
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
- ✅ 버튼을 눌르면 WASMRenderer 클래스의 함수를 WASM을 통해 불러서 WebGL로 배경색 변경
  - ✅ WASM을 사용하기 위해서 CMake를 사용해서 C++ 프로젝트를 구성
  - ✅ CMake를 모르는 사람을 위해서 shell 스크립트 작성
- ✅ WASMRenderer 클래스를 통한 WebGL 렌더링
- ✅ 클린한 클래스 기반 API 제공
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
sh ./build-wasm.sh
```

이 스크립트는 다음을 수행합니다:
- `build` 디렉토리 생성
- Emscripten을 사용해 CMake 설정
- C++ 코를 WASM으로 컴파일
- `web/public/WASMRenderer.js`와 `web/public/WASMRenderer.wasm` 파일 생성

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

1. 웹페이지가 로드되면 왼쪽에 WebGL 캔버스와 오른쪽에 "랜덤 배경색 변경" 버튼이 표시됩니다.
2. 버튼을 클릭하면 C++ WASMRenderer 클래스의 WebGL 함수가 호출됩니다.
3. WebGL을 통해 캔버스 배경색이 랜덤하게 변경됩니다.

## 주요 파일 설명

- **`src/WASMRenderer.h`**: WASMRenderer 클래스 헤더 파일
- **`src/WASMRenderer.cpp`**: WebGL 렌더링을 위한 WASMRenderer 클래스 구현
- **`CMakeLists.txt`**: Emscripten으로 WASM 빌드를 위한 CMake 설정
- **`build-wasm.sh`**: CMake를 모르는 사용자를 위한 간편한 빌드 스크립트
- **`web/src/wasmLoader.js`**: WASM 모듈 로드 및 클래스 API 제공
- **`web/src/App.jsx`**: WebGL 캔버스가 있는 메인 React 컴포넌트

## API 설명

### WASMRenderer 클래스 API

```javascript
import { createRenderer, initRendererWebGL, setRendererRandomBackgroundColor } from './wasmLoader'

// 렌더러 인스턴스 생성
await createRenderer()

// WebGL 초기화
await initRendererWebGL('#canvas-id')

// 랜덤 배경색 설정
await setRendererRandomBackgroundColor()
```

## 문제 해결

- **WASM 파일을 찾을 수 없음**: `build-wasm.sh`를 실행하여 WASM 파일을 먼저 빌드해주세요.
- **Emscripten 명령어를 찾을 수 없음**: Emscripten SDK가 제대로 설치되고 환경 변수가 설정되었는지 확인해주세요.
- **개발 서버 오류**: `web` 디렉토리에서 `npm install`로 의존성을 설치했는지 확인해주세요.