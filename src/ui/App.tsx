import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-4xl">
        Vite + React + electron + typescript + tailwind
      </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/ui/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
