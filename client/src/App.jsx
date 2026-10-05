import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Validate from './pages/Validate';
import Guardian from './pages/Guardian';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/validar" element={<Validate />} />
      <Route path="/guardiao" element={<Guardian />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
