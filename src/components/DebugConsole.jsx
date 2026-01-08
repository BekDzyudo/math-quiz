import { useState, useEffect } from 'react';

function DebugConsole() {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Console.log override
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, { 
        type: 'log', 
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        time: new Date().toLocaleTimeString()
      }]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, { 
        type: 'error', 
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        time: new Date().toLocaleTimeString()
      }]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev, { 
        type: 'warn', 
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        time: new Date().toLocaleTimeString()
      }]);
    };

    // Global error handler
    const handleError = (event) => {
      setLogs(prev => [...prev, { 
        type: 'error', 
        message: `❌ ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        time: new Date().toLocaleTimeString()
      }]);
    };

    const handleUnhandledRejection = (event) => {
      setLogs(prev => [...prev, { 
        type: 'error', 
        message: `❌ Promise rejection: ${event.reason}`,
        time: new Date().toLocaleTimeString()
      }]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '10px',
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 10000
        }}
      >
        📋 Debug Console
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40vh',
      background: 'rgba(0, 0, 0, 0.95)',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '11px',
      overflowY: 'auto',
      padding: '10px',
      zIndex: 10000,
      borderTop: '2px solid #333'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '5px'
      }}>
        <strong style={{ color: '#fff' }}>🐛 Debug Console ({logs.length})</strong>
        <div>
          <button
            onClick={() => setLogs([])}
            style={{
              padding: '5px 10px',
              background: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              marginRight: '5px'
            }}
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              padding: '5px 10px',
              background: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Hide
          </button>
        </div>
      </div>
      
      <div style={{ maxHeight: 'calc(40vh - 60px)', overflowY: 'auto' }}>
        {logs.length === 0 && (
          <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No logs yet...
          </div>
        )}
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              marginBottom: '5px',
              padding: '5px',
              background: log.type === 'error' ? 'rgba(255, 0, 0, 0.1)' : 
                          log.type === 'warn' ? 'rgba(255, 255, 0, 0.1)' : 
                          'transparent',
              borderLeft: `3px solid ${
                log.type === 'error' ? '#ff0000' : 
                log.type === 'warn' ? '#ffff00' : 
                '#00ff00'
              }`,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            <span style={{ color: '#888', marginRight: '10px' }}>[{log.time}]</span>
            <span style={{ 
              color: log.type === 'error' ? '#ff6b6b' : 
                     log.type === 'warn' ? '#ffd93d' : 
                     '#6bcf7f',
              fontWeight: 'bold',
              marginRight: '10px'
            }}>
              {log.type.toUpperCase()}
            </span>
            <span style={{ color: '#fff' }}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebugConsole;
