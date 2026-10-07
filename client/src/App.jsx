import { Routes, Route } from 'react-router-dom';
import Envelope from './pages/Envelope';
import Home from './pages/Home';
import Trail from './pages/Trail';
import Tasks from './pages/Tasks';
import Mission from './pages/Mission';
import Reward from './pages/Reward';
import Guardian from './pages/Guardian';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Envelope />} />
      <Route path="/home" element={<Home />} />
      <Route path="/trail" element={<Trail />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/mission" element={<Mission />} />
      <Route path="/reward" element={<Reward />} />
      <Route path="/guardiao" element={<Guardian />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
