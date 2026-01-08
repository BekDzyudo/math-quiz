import React, { useState } from 'react';

function DebugPanel({ answersM, yopiqQuizAnswers, result }) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  const filled = result.filter(item => item && item.javob && item.javob.toString().trim()).length;
  const empty = result.filter(item => !item || !item.javob || !item.javob.toString().trim()).length;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50 font-bold"
      >
        🐛 Debug
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-gray-900 text-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h2 className="text-xl font-bold">🐛 Debug Panel</h2>
              <button onClick={togglePanel} className="text-red-500 text-2xl font-bold">✕</button>
            </div>

            {/* Summary */}
            <div className="mb-4 bg-gray-800 p-3 rounded">
              <h3 className="font-bold text-lg mb-2">📊 Umumiy ma'lumot:</h3>
              <p>✅ To'ldirilgan: <span className="text-green-400 font-bold">{filled}</span></p>
              <p>❌ Bo'sh: <span className="text-red-400 font-bold">{empty}</span></p>
              <p>🔢 Jami: <span className="text-blue-400 font-bold">{result.length}</span></p>
            </div>

            {/* Variant answers (1-35) */}
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2 text-blue-400">📝 Variant javoblar (1-35):</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const answer = answersM.find(a => a.savol_raqami === i + 1);
                  return (
                    <div 
                      key={i} 
                      className={`p-2 rounded text-center font-bold ${
                        answer && answer.javob ? 'bg-green-600' : 'bg-gray-700'
                      }`}
                    >
                      {i + 1}: {answer?.javob || '❌'}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Written answers (36-45: a,b) - 20 questions */}
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2 text-yellow-400">✍️ Yozma javoblar (36a-45b): 20 ta</h3>
              <div className="space-y-2">
                {yopiqQuizAnswers.map((item, index) => {
                  const questionNum = 36 + Math.floor(index / 2);
                  const part = index % 2 === 0 ? 'a' : 'b';
                  const label = `${questionNum}${part}`;
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-2 rounded flex justify-between ${
                        item && item.javob && item.javob.toString().trim() ? 'bg-green-700' : 'bg-gray-700'
                      }`}
                    >
                      <span className="font-bold">{label}:</span>
                      <span className="text-right truncate ml-2">{item?.javob || '❌ Bo\'sh'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LocalStorage Data */}
            <div className="mb-4 bg-gray-800 p-3 rounded">
              <h3 className="font-bold text-lg mb-2 text-purple-400">💾 LocalStorage:</h3>
              <div className="text-xs space-y-1">
                <p>answersM: {localStorage.getItem('answersM')?.length || 0} bytes</p>
                <p>answers_yopiq: {localStorage.getItem('answers_yopiq')?.length || 0} bytes</p>
                <p>test-code: {localStorage.getItem('test-code') || '❌'}</p>
              </div>
            </div>

            {/* Full Result JSON */}
            <details className="bg-gray-800 p-3 rounded">
              <summary className="font-bold cursor-pointer text-orange-400">🔍 To'liq JSON (bosing)</summary>
              <pre className="mt-2 text-xs overflow-x-auto bg-gray-900 p-2 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </>
  );
}

export default DebugPanel;
