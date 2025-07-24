#pragma once
#include <string>
#include <emscripten/html5.h>

class WASMRenderer
{
private:
  EMSCRIPTEN_WEBGL_CONTEXT_HANDLE webglContext;
  bool isInitialized;

public:
  WASMRenderer();
  ~WASMRenderer();

  // WebGL 관련 함수들
  bool initWebGL(const std::string &canvasId);
  void setBackgroundColor(float r, float g, float b);
  void renderFrame();
  void setRandomBackgroundColor();

  // 상태 확인 함수
  bool isWebGLInitialized() const;
};
