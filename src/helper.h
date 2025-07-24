#pragma once
#include <string>

// WebGL 관련 함수들
void initWebGL(const std::string &canvasId);
void setBackgroundColor(float r, float g, float b);
void renderFrame();
void setRandomBackgroundColor();