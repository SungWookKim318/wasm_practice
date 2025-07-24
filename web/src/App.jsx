import { useEffect, useRef, useState } from 'react'
import './App.css'
import { initWebGL, setRandomBackgroundColor } from './wasmLoader'

function App() {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isWebGLInitialized, setIsWebGLInitialized] = useState(false)

  // WebGL 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && !isWebGLInitialized) {
      initializeWebGL()
    }
  }, [isWebGLInitialized])

  const initializeWebGL = async () => {
    try {
      // Canvas에 ID 설정
      const canvas = canvasRef.current
      if (canvas) {
        canvas.id = 'webgl-canvas'
        await initWebGL('#webgl-canvas')
        setIsWebGLInitialized(true)
        console.log('WebGL 초기화 완료')
      }
    } catch (error) {
      console.error('WebGL 초기화 실패:', error)
    }
  }

  const handleChangeColor = async () => {
    if (!isWebGLInitialized) {
      console.log('WebGL이 아직 초기화되지 않았습니다.')
      return
    }

    setIsLoading(true)
    try {
      // C++에서 WebGL을 통해 배경색 변경
      await setRandomBackgroundColor()
    } catch (error) {
      console.error('색상 변경 중 오류 발생:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>WASM + WebGL Color Changer</h1>
      <div className="content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width="400"
            height="300"
            className="color-canvas"
          />
          <p className="color-info">
            {isWebGLInitialized ? 'WebGL 초기화 완료' : 'WebGL 초기화 중...'}
          </p>
        </div>
        <div className="button-container">
          <button
            onClick={handleChangeColor}
            disabled={isLoading || !isWebGLInitialized}
            className="change-color-btn"
          >
            {isLoading ? '색상 변경 중...' : '랜덤 배경색 변경'}
          </button>

          <p className="instruction">
            버튼을 클릭하여 C++ WebGL 코드를 통해<br/>
            배경색을 변경합니다
          </p>

          <div className="method-info">
            <small>
              <strong>사용 방법:</strong> C++ WebGL → WASM → JavaScript<br/>
              모든 WebGL 로직은 C++에서 처리됩니다
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
