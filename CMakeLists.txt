cmake_minimum_required(VERSION 3.10)

project(WASMRenderer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten 설정
message(STATUS "CMAKE_SYSTEM_NAME: ${CMAKE_SYSTEM_NAME}")
message(STATUS "EMSCRIPTEN: ${EMSCRIPTEN}")
message(STATUS "CMAKE_TOOLCHAIN_FILE: ${CMAKE_TOOLCHAIN_FILE}")

# Emscripten 툴체인 파일이 설정되어 있는지 확인
if(CMAKE_TOOLCHAIN_FILE AND CMAKE_TOOLCHAIN_FILE MATCHES "Emscripten")
    message(STATUS "Emscripten detected via toolchain file, proceeding with build...")
    set(CMAKE_EXECUTABLE_SUFFIX ".js")

    # 소스 파일
    add_executable(WASMRenderer src/WASMRenderer.cpp)

    # Emscripten 링크 플래그 (WebGL 지원 추가)
    set_target_properties(WASMRenderer PROPERTIES
        LINK_FLAGS "-s WASM=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME='createWasmModule' --bind -s USE_WEBGL2=1 -s FULL_ES3=1"
    )

    # 출력 파일을 web/public 디렉토리로 설정
    set_target_properties(WASMRenderer PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/web/public"
    )
else()
    message(FATAL_ERROR "This project requires Emscripten to build. Please use emcmake.")
endif()
