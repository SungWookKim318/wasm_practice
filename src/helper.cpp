#include "helper.h"
#include <random>
#include <emscripten/bind.h>
#include <emscripten/html5.h>
#include <GLES3/gl3.h>
#include <iostream>
#include <string>

// 전역 랜덤 생성기 (성능 향상을 위해)
static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<> dis(0, 255);

// WebGL 컨텍스트 관련 전역 변수
static EMSCRIPTEN_WEBGL_CONTEXT_HANDLE webglContext = 0;
static bool isWebGLInitialized = false;

// RGB 구조체를 반환하는 간단한 함수
RGBColor getRandomRGBStruct()
{
  RGBColor color;
  color.r = dis(gen);
  color.g = dis(gen);
  color.b = dis(gen);
  return color;
}

// WebGL 초기화 함수
void initWebGL(const std::string &canvasId)
{
  EmscriptenWebGLContextAttributes attrs;
  emscripten_webgl_init_context_attributes(&attrs);
  attrs.alpha = true;
  attrs.depth = true;
  attrs.stencil = false;
  attrs.antialias = true;
  attrs.premultipliedAlpha = false;
  attrs.preserveDrawingBuffer = false;
  attrs.majorVersion = 2;
  attrs.minorVersion = 0;

  webglContext = emscripten_webgl_create_context(canvasId.c_str(), &attrs);
  if (webglContext <= 0)
  {
    std::cout << "WebGL context creation failed!" << std::endl;
    return;
  }

  EMSCRIPTEN_RESULT result = emscripten_webgl_make_context_current(webglContext);
  if (result != EMSCRIPTEN_RESULT_SUCCESS)
  {
    std::cout << "Failed to make WebGL context current!" << std::endl;
    return;
  }

  // WebGL 초기 설정
  glEnable(GL_DEPTH_TEST);
  glDepthFunc(GL_LEQUAL);

  isWebGLInitialized = true;
  std::cout << "WebGL initialized successfully!" << std::endl;
}

// 배경색 설정 함수 (0.0-1.0 범위)
void setBackgroundColor(float r, float g, float b)
{
  if (!isWebGLInitialized)
  {
    std::cout << "WebGL not initialized!" << std::endl;
    return;
  }

  emscripten_webgl_make_context_current(webglContext);
  glClearColor(r, g, b, 1.0f);
}

// 프레임 렌더링 함수
void renderFrame()
{
  if (!isWebGLInitialized)
  {
    std::cout << "WebGL not initialized!" << std::endl;
    return;
  }

  emscripten_webgl_make_context_current(webglContext);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

// 랜덤 배경색 설정 함수
void setRandomBackgroundColor()
{
  if (!isWebGLInitialized)
  {
    std::cout << "WebGL not initialized!" << std::endl;
    return;
  }

  float r = dis(gen) / 255.0f;
  float g = dis(gen) / 255.0f;
  float b = dis(gen) / 255.0f;

  setBackgroundColor(r, g, b);
  renderFrame();
}

// Emscripten 바인딩
EMSCRIPTEN_BINDINGS(helper_module)
{
  using namespace emscripten;
  // RGBColor 구조체를 JavaScript에 바인딩
  value_object<RGBColor>("RGBColor")
      .field("r", &RGBColor::r)
      .field("g", &RGBColor::g)
      .field("b", &RGBColor::b);

  // 함수 바인딩
  function("getRandomRGBStruct", &getRandomRGBStruct);

  // WebGL 관련 함수 바인딩
  function("initWebGL", &initWebGL);
  function("setBackgroundColor", &setBackgroundColor);
  function("renderFrame", &renderFrame);
  function("setRandomBackgroundColor", &setRandomBackgroundColor);
}
