import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskDashboard from './components/TaskDashboard';
import './styles/main.scss';
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="/tasks" element={<TaskDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;