#pragma once

// RGB 색상을 나타내는 구조체
struct RGBColor
{
  int r; // Red (0-255)
  int g; // Green (0-255)
  int b; // Blue (0-255)
};

// RGB 구조체를 반환하는 함수
RGBColor getRandomRGBStruct();