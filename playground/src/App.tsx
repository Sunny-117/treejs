import { useState, useEffect } from 'react';
import CodeDetectionDemo from './demos/CodeDetectionDemo';
import StreamingDemo from './demos/StreamingDemo';
import SSEDemo from './demos/SSEDemo';
import BrowserDemo from './demos/BrowserDemo';
import ReactHooksDemo from './demos/ReactHooksDemo';
import { AsyncProcessorDemo } from './demos/AsyncProcessorDemo';
import PreciseTimerDemo from './demos/PreciseTimerDemo';

type DemoType = 'code-detection' | 'streaming' | 'sse' | 'browser' | 'react-hooks' | 'async-processor' | 'precise-timer';
const validDemos: DemoType[] = ['code-detection', 'streaming', 'sse', 'browser', 'react-hooks', 'async-processor', 'precise-timer'];

function App() {
  const getInitialDemo = (): DemoType => {
    const hash = window.location.hash.slice(1);
    return validDemos.includes(hash as DemoType) ? (hash as DemoType) : 'code-detection';
  };

  const [activeDemo, setActiveDemo] = useState<DemoType>(getInitialDemo());

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (validDemos.includes(hash as DemoType)) {
        setActiveDemo(hash as DemoType);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleDemoChange = (demo: DemoType) => {
    window.location.hash = demo;
    setActiveDemo(demo);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Outilx Playground</h1>
      <p>测试和演示所有 Outilx 包的功能</p>

      <nav style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <button
          onClick={() => handleDemoChange('code-detection')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            border: 'none',
            background: activeDemo === 'code-detection' ? '#333' : '#eee',
            color: activeDemo === 'code-detection' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Code Detection
        </button>
        <button
          onClick={() => handleDemoChange('streaming')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            border: 'none',
            background: activeDemo === 'streaming' ? '#333' : '#eee',
            color: activeDemo === 'streaming' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Streaming Simulator
        </button>
        <button
          onClick={() => handleDemoChange('sse')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            border: 'none',
            background: activeDemo === 'sse' ? '#333' : '#eee',
            color: activeDemo === 'sse' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          SSE
        </button>
        <button
          onClick={() => handleDemoChange('browser')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            border: 'none',
            background: activeDemo === 'browser' ? '#333' : '#eee',
            color: activeDemo === 'browser' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Browser Utils
        </button>
        <button
          onClick={() => handleDemoChange('react-hooks')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            border: 'none',
            background: activeDemo === 'react-hooks' ? '#333' : '#eee',
            color: activeDemo === 'react-hooks' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          React Hooks
        </button>
        <button
          onClick={() => handleDemoChange('async-processor')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            border: 'none',
            background: activeDemo === 'async-processor' ? '#333' : '#eee',
            color: activeDemo === 'async-processor' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Async Processor
        </button>
        <button
          onClick={() => handleDemoChange('precise-timer')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: activeDemo === 'precise-timer' ? '#333' : '#eee',
            color: activeDemo === 'precise-timer' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Precise Timer
        </button>
      </nav>

      <div>
        {activeDemo === 'code-detection' && <CodeDetectionDemo />}
        {activeDemo === 'streaming' && <StreamingDemo />}
        {activeDemo === 'sse' && <SSEDemo />}
        {activeDemo === 'browser' && <BrowserDemo />}
        {activeDemo === 'react-hooks' && <ReactHooksDemo />}
        {activeDemo === 'async-processor' && <AsyncProcessorDemo />}
        {activeDemo === 'precise-timer' && <PreciseTimerDemo />}
      </div>
    </div>
  );
}

export default App;
