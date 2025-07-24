import { useEffect, useRef, useState } from 'react'
import './App.css'
import { getRandomRGB } from './wasmLoader'

function App() {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentColor, setCurrentColor] = useState({ r: 128, g: 128, b: 128 })

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      updateCanvasColor(ctx, currentColor)
    }
  }, [currentColor])

  const updateCanvasColor = (ctx, color) => {
    if (!ctx) return

    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
    ctx.fillRect(0, 0, 400, 300)
  }

  const handleChangeColor = async () => {
    setIsLoading(true)
    try {
      // 간단하고 깔끔한 구조체 기반 방법
      const newColor = await getRandomRGB();
      setCurrentColor(newColor)

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        updateCanvasColor(ctx, newColor)
      }
    } catch (error) {
      console.error('색상 변경 중 오류 발생:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>WASM + React Color Changer</h1>
      <div className="content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width="400"
            height="300"
            className="color-canvas"
          />
          <p className="color-info">
            현재 색상: RGB({currentColor.r}, {currentColor.g}, {currentColor.b})
          </p>
        </div>
        <div className="button-container">
          <button
            onClick={handleChangeColor}
            disabled={isLoading}
            className="change-color-btn"
          >
            {isLoading ? '색상 변경 중...' : '랜덤 색상 변경'}
          </button>

          <p className="instruction">
            버튼을 클릭하여 WASM 구조체를 통해<br/>
            깔끔하게 랜덤 RGB 색상을 생성합니다
          </p>

          <div className="method-info">
            <small>
              <strong>사용 방법:</strong> C++ 구조체 → JavaScript 객체<br/>
              비트 패킹 없이 직접적인 데이터 전달
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
