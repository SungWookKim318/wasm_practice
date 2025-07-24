cmake_minimum_required(VERSION 4.0)
project(HelloWasm LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(hello hello_wasm.cpp)

set_target_properties(hello PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/public"
  OUTPUT_NAME "hello"
  SUFFIX ".html"
)

if(EMSCRIPTEN)
  message(STATUS "🧩 Detected Emscripten → enabling HTML output")

  set(EXPORT_METHODS '["ccall","cwrap"]')
  set(EXPORTED_FUNCS '["_main"]')

  add_definitions(
    "-s EXPORTED_RUNTIME_METHODS=${EXPORT_METHODS}"
    "-s EXPORTED_FUNCTIONS=${EXPORTED_FUNCS}"
  )

  set_target_properties(hello PROPERTIES
    LINK_FLAGS "-s WASM=1 \
                -s ALLOW_MEMORY_GROWTH=1 \
                -o ${CMAKE_CURRENT_BINARY_DIR}/public/hello.html"
  )
endif()