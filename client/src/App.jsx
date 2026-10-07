import { Routes, Route } from 'react-router-dom';
import Envelope from './pages/Envelope';
import Home from './pages/Home';
import Trilha from './pages/Trilha';
import Tasks from './pages/Tasks';
import Validate from './pages/Validate';
import Guardian from './pages/Guardian';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Envelope />} />
      <Route path="/home" element={<Home />} />
      <Route path="/trilha" element={<Trilha />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/validar" element={<Validate />} />
      <Route path="/guardiao" element={<Guardian />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
