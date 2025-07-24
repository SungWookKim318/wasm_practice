#include "helper.h"
#include <random>
#include <emscripten/bind.h>

// 전역 랜덤 생성기 (성능 향상을 위해)
static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<> dis(0, 255);

// RGB 구조체를 반환하는 간단한 함수
RGBColor getRandomRGBStruct()
{
  RGBColor color;
  color.r = dis(gen);
  color.g = dis(gen);
  color.b = dis(gen);
  return color;
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
}
