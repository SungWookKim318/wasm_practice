#pragma once
#include <string>

// RGB 색상을 나타내는 구조체
struct RGBColor
{
  int r; // Red (0-255)
  int g; // Green (0-255)
  int b; // Blue (0-255)
};

// RGB 구조체를 반환하는 함수
RGBColor getRandomRGBStruct();

// WebGL 관련 함수들
void initWebGL(const std::string &canvasId);
void setBackgroundColor(float r, float g, float b);
void renderFrame();
void setRandomBackgroundColor();