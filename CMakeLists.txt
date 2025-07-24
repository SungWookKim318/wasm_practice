cmake_minimum_required(VERSION 3.10)

project(WasmHelper)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten 설정
if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
    set(CMAKE_EXECUTABLE_SUFFIX ".js")

    # 소스 파일
    add_executable(helper src/helper.cpp)

    # Emscripten 링크 플래그
    set_target_properties(helper PROPERTIES
        LINK_FLAGS "-s WASM=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME='createWasmModule' --bind"
    )

    # 출력 파일을 web/public 디렉토리로 설정
    set_target_properties(helper PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/web/public"
    )
else()
    message(FATAL_ERROR "This project requires Emscripten to build")
endif()
