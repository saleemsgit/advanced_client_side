import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PropertyPage from './pages/PropertyPage';
import { FavouritesProvider } from './context/FavouritesContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <BrowserRouter>
      <FavouritesProvider>
        <DndProvider backend={HTML5Backend}>
          <div className="App">
            {/* <header className="App-header" style={{ padding: '1px 0', background: '#0f7a80', color: '#fff' }}>
              <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: 18 }}>Property Search Demo</h1>
                <nav>
                  <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Home</Link>
                </nav>
              </div>
            </header> */}

            <main style={{ paddingTop: 18 }}>
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/property/:id" element={<PropertyPage />} />
              </Routes>
            </main>
          </div>
        </DndProvider>
      </FavouritesProvider>
    </BrowserRouter>
  );
}

export default App;
