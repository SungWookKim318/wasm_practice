#include <emscripten/emscripten.h>
#include <random>

extern "C"
{
  // 임의의 RGB 값을 생성하는 함수
  EMSCRIPTEN_KEEPALIVE
  int getRandomRed()
  {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    return dis(gen);
  }

  EMSCRIPTEN_KEEPALIVE
  int getRandomGreen()
  {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    return dis(gen);
  }

  EMSCRIPTEN_KEEPALIVE
  int getRandomBlue()
  {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    return dis(gen);
  }

  // 한 번에 RGB 값을 모두 생성하는 함수
  EMSCRIPTEN_KEEPALIVE
  int getRandomRGB()
  {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);

    int r = dis(gen);
    int g = dis(gen);
    int b = dis(gen);

    // RGB를 하나의 정수로 패킹 (24비트)
    return (r << 16) | (g << 8) | b;
  }
}
