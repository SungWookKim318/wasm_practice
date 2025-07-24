import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  initRendererWebGL,
  setRendererRandomBackgroundColor
} from './wasmLoader'

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
        await initRendererWebGL('#webgl-canvas')
        setIsWebGLInitialized(true)
        console.log('WASMRenderer 클래스를 통한 WebGL 초기화 완료')
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
      await setRendererRandomBackgroundColor()
      console.log('WASMRenderer 클래스를 통한 색상 변경')
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
              <strong>사용 방법:</strong> C++ WASMRenderer → WASM → JavaScript<br/>
              WASMRenderer 클래스를 통해 모든 WebGL 로직이 처리됩니다
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
