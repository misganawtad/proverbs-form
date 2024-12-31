import React, { useState } from 'react';
import ProverbForm from './components/ProverbForm';
import ProverbList from './components/ProverbList';

function App() {
  const [showList, setShowList] = useState(false);

  return (
    <div className="App">
      <div className="bg-blue-600 p-4 mb-4">
        <button 
          onClick={() => setShowList(!showList)}
          className="bg-white text-blue-600 px-4 py-2 rounded"
        >
          {showList ? 'Add New Proverb' : 'View All Proverbs'}
        </button>
      </div>
      
      {showList ? <ProverbList /> : <ProverbForm />}
    </div>
  );
}

export default App;