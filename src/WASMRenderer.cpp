#include "WASMRenderer.h"
#include <random>
#include <emscripten/bind.h>
#include <emscripten/html5.h>
#include <GLES3/gl3.h>
#include <iostream>

// 전역 랜덤 생성기 (성능 향상을 위해)
static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<> dis(0, 255);

// 전역 WASMRenderer 인스턴스
static WASMRenderer *rendererInstance = nullptr;

WASMRenderer::WASMRenderer() : webglContext(0), isInitialized(false)
{
  if (rendererInstance == nullptr)
  {
    rendererInstance = this;
  }
}

WASMRenderer::~WASMRenderer()
{
  if (webglContext > 0)
  {
    emscripten_webgl_destroy_context(webglContext);
  }
  if (rendererInstance == this)
  {
    rendererInstance = nullptr;
  }
}

bool WASMRenderer::initWebGL(const std::string &canvasId)
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
    return false;
  }

  EMSCRIPTEN_RESULT result = emscripten_webgl_make_context_current(webglContext);
  if (result != EMSCRIPTEN_RESULT_SUCCESS)
  {
    std::cout << "Failed to make WebGL context current!" << std::endl;
    return false;
  }

  // WebGL 초기 설정
  glEnable(GL_DEPTH_TEST);
  glDepthFunc(GL_LEQUAL);

  isInitialized = true;
  std::cout << "WebGL initialized successfully!" << std::endl;
  return true;
}

void WASMRenderer::setBackgroundColor(float r, float g, float b)
{
  if (!isInitialized)
  {
    std::cout << "WebGL not initialized!" << std::endl;
    return;
  }

  emscripten_webgl_make_context_current(webglContext);
  glClearColor(r, g, b, 1.0f);
}

void WASMRenderer::renderFrame()
{
  if (!isInitialized)
  {
    std::cout << "WebGL not initialized!" << std::endl;
    return;
  }

  emscripten_webgl_make_context_current(webglContext);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

void WASMRenderer::setRandomBackgroundColor()
{
  if (!isInitialized)
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

bool WASMRenderer::isWebGLInitialized() const
{
  return isInitialized;
}

// Emscripten 바인딩
EMSCRIPTEN_BINDINGS(WASMRenderer_module)
{
  using namespace emscripten;

  // WASMRenderer 클래스 바인딩
  class_<WASMRenderer>("WASMRenderer")
      .constructor<>()
      .function("initWebGL", &WASMRenderer::initWebGL)
      .function("setBackgroundColor", &WASMRenderer::setBackgroundColor)
      .function("renderFrame", &WASMRenderer::renderFrame)
      .function("setRandomBackgroundColor", &WASMRenderer::setRandomBackgroundColor)
      .function("isWebGLInitialized", &WASMRenderer::isWebGLInitialized);
}
