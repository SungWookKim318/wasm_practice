// WASM 모듈을 로드하는 유틸리티
let wasmModule = null;
let isLoading = false;

export const loadWasm = async () => {
  if (wasmModule) {
    return wasmModule;
  }

  if (isLoading) {
    // 이미 로딩 중이면 조금 기다렸다가 다시 확인
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (wasmModule) {
          clearInterval(checkInterval);
          resolve(wasmModule);
        } else if (!isLoading) {
          clearInterval(checkInterval);
          reject(new Error('Loading failed'));
        }
      }, 100);
    });
  }

  isLoading = true;

  try {
    // 방법 1: script 태그로 동적 로드
    const script = document.createElement('script');
    script.src = '/WASMRenderer.js';
    script.type = 'text/javascript';
    const loadPromise = new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          // 전역에서 createWasmModule 함수 접근
          if (typeof window.createWasmModule === 'function') {
            wasmModule = await window.createWasmModule({
              locateFile: (path) => {
                if (path.endsWith('.wasm')) {
                  return `/WASMRenderer.wasm`;
                }
                return path;
              }
            });
            console.log('WASM module loaded successfully via script tag');
            isLoading = false;
            resolve(wasmModule);
          } else {
            throw new Error('createWasmModule function not found');
          }
        } catch (error) {
          isLoading = false;
          reject(error);
        }
      };
      script.onerror = (error) => {
        isLoading = false;
        reject(new Error('Failed to load WASMRenderer.js script: ' + error.message));
      };
      // 스크립트가 이미 로드되어 있는지 확인
      const existingScript = document.querySelector('script[src="/WASMRenderer.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      document.head.appendChild(script);
    });

    return await loadPromise;
  } catch (error) {
    isLoading = false;
    console.error('Failed to load WASM module:', error);
    // 방법 2: fetch로 대체 시도
    try {
      console.log('Trying fallback method with fetch...');
      const response = await fetch('/WASMRenderer.js');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const scriptContent = await response.text();
      // eval을 사용하여 스크립트 실행 (Firefox 호환성)
      const func = new Function(scriptContent + '; return createWasmModule;');
      const createWasmModule = func();
      wasmModule = await createWasmModule({
        locateFile: (path) => {
          if (path.endsWith('.wasm')) {
            return `/WASMRenderer.wasm`;
          }
          return path;
        }
      });
      console.log('WASM module loaded successfully via fetch');
      return wasmModule;
    } catch (fetchError) {
      console.error('Fallback method also failed:', fetchError);
      throw new Error(`All loading methods failed. Original error: ${error.message}, Fallback error: ${fetchError.message}`);
    }
  }
};

// WASMRenderer 클래스 기반 API
let rendererInstance = null;

export const createRenderer = async () => {
  const module = await loadWasm();
  try {
    rendererInstance = new module.WASMRenderer();
    console.log('WASMRenderer instance created');
    return rendererInstance;
  } catch (error) {
    console.error('Failed to create WASMRenderer instance:', error);
    throw error;
  }
};

export const getRenderer = () => {
  return rendererInstance;
};

export const initRendererWebGL = async (canvasId) => {
  if (!rendererInstance) {
    await createRenderer();
  }
  try {
    const success = rendererInstance.initWebGL(canvasId);
    console.log('WASMRenderer WebGL initialized:', success);
    return success;
  } catch (error) {
    console.error('Failed to initialize WASMRenderer WebGL:', error);
    throw error;
  }
};

export const setRendererBackgroundColor = async (r, g, b) => {
  if (!rendererInstance) {
    throw new Error('Renderer not initialized. Call createRenderer() first.');
  }
  try {
    rendererInstance.setBackgroundColor(r, g, b);
    console.log('WASMRenderer background color set:', { r, g, b });
  } catch (error) {
    console.error('Failed to set WASMRenderer background color:', error);
    throw error;
  }
};

export const renderRendererFrame = async () => {
  if (!rendererInstance) {
    throw new Error('Renderer not initialized. Call createRenderer() first.');
  }
  try {
    rendererInstance.renderFrame();
  } catch (error) {
    console.error('Failed to render WASMRenderer frame:', error);
    throw error;
  }
};

export const setRendererRandomBackgroundColor = async () => {
  if (!rendererInstance) {
    throw new Error('Renderer not initialized. Call createRenderer() first.');
  }
  try {
    rendererInstance.setRandomBackgroundColor();
    console.log('WASMRenderer random background color set');
  } catch (error) {
    console.error('Failed to set WASMRenderer random background color:', error);
    throw error;
  }
};

export const isRendererInitialized = async () => {
  if (!rendererInstance) {
    return false;
  }
  try {
    return rendererInstance.isWebGLInitialized();
  } catch (error) {
    console.error('Failed to check WASMRenderer initialization status:', error);
    return false;
  }
};
