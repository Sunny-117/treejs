import { useState, useEffect, useRef } from 'react';
import { createPreciseTimer } from '@outilx/browser';

function PreciseTimerDemo() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof createPreciseTimer> | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = createPreciseTimer();
    return () => {
      timerRef.current?.dispose();
    };
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false, fractionalSecondDigits: 3 } as any);
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleStart = () => {
    if (running || !timerRef.current) return;
    setRunning(true);
    setSeconds(0);
    addLog('计时器启动');
    let count = 0;
    intervalIdRef.current = timerRef.current.setInterval(() => {
      count += 1;
      setSeconds(count);
      addLog(`tick ${count}s`);
    }, 1000);
  };

  const handleStop = () => {
    if (!running || !timerRef.current || intervalIdRef.current === null) return;
    timerRef.current.clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
    setRunning(false);
    addLog('计时器停止');
  };

  const handleTimeout = () => {
    if (!timerRef.current) return;
    addLog('设置 3 秒后触发 setTimeout...');
    timerRef.current.setTimeout(() => {
      addLog('setTimeout 已触发 (3s)');
    }, 3000);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div>
      <h2>Precise Timer Demo</h2>
      <p>
        基于 Web Worker 的精准计时器，即使切换标签页（页签失活）也不会被浏览器节流。
        <br />
        <strong>测试方法：</strong>启动计时器后切换到其他标签页，等待一段时间后切回，观察日志中的时间间隔是否依然精准为 1 秒。
      </p>

      <div style={{ marginBottom: '20px', padding: '20px', background: '#f0f7ff', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '16px' }}>
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleStart}
            disabled={running}
            style={{
              padding: '10px 24px',
              cursor: running ? 'not-allowed' : 'pointer',
              background: running ? '#ccc' : '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          >
            启动 setInterval
          </button>
          <button
            onClick={handleStop}
            disabled={!running}
            style={{
              padding: '10px 24px',
              cursor: !running ? 'not-allowed' : 'pointer',
              background: !running ? '#ccc' : '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          >
            停止
          </button>
          <button
            onClick={handleTimeout}
            style={{
              padding: '10px 24px',
              cursor: 'pointer',
              background: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          >
            测试 setTimeout (3s)
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>日志</h3>
        <button
          onClick={handleClearLogs}
          style={{ padding: '4px 12px', cursor: 'pointer', background: '#eee', border: 'none', borderRadius: '4px' }}
        >
          清空
        </button>
      </div>
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          background: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'monospace',
          fontSize: '13px',
          padding: '12px',
          borderRadius: '6px',
        }}
      >
        {logs.length === 0 && <div style={{ color: '#666' }}>暂无日志，点击上方按钮开始测试</div>}
        {logs.map((log, i) => (
          <div key={i} style={{ padding: '2px 0' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreciseTimerDemo;
