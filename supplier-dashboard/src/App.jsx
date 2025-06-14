import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // ✅ Use the new unified dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ updated */}
      </Routes>
    </Router>
  );
}

export default App;
