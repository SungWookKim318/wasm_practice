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
    script.src = '/helper.js';
    script.type = 'text/javascript';
    
    const loadPromise = new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          // 전역에서 createWasmModule 함수 접근
          if (typeof window.createWasmModule === 'function') {
            wasmModule = await window.createWasmModule({
              locateFile: (path) => {
                if (path.endsWith('.wasm')) {
                  return `/helper.wasm`;
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
        reject(new Error('Failed to load helper.js script: ' + error.message));
      };
      
      // 스크립트가 이미 로드되어 있는지 확인
      const existingScript = document.querySelector('script[src="/helper.js"]');
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
      const response = await fetch('/helper.js');
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
            return `/helper.wasm`;
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

export const getRandomRGB = async () => {
  const module = await loadWasm();
  
  try {
    // WASM 함수 호출
    const rgb = module._getRandomRGB();
    
    // 24비트 RGB 값을 개별 R, G, B 값으로 분리
    const r = (rgb >> 16) & 0xFF;
    const g = (rgb >> 8) & 0xFF;
    const b = rgb & 0xFF;
    
    return { r, g, b };
  } catch (error) {
    console.error('Failed to call WASM function:', error);
    // 폴백: JavaScript로 랜덤 RGB 생성
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  }
};
