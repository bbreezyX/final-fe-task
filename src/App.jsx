import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import EditTask from './components/TaskEdit';
import PrivateRoute from './routes/PrivateRoute';
import ProtectedLogin from './routes/ProtectedLogin';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const routeConfig = [
  { path: '/', element: <Login />, wrapper: ProtectedLogin },
  { path: '/register', element: <Register />, wrapper: ProtectedLogin },
  { path: '/dashboard', element: <Dashboard />, wrapper: PrivateRoute },
  { path: '/task', element: <TaskList />, wrapper: PrivateRoute },
  { path: '/add-task', element: <TaskForm />, wrapper: PrivateRoute },
  { path: '/edit-task/:id', element: <EditTask />, wrapper: PrivateRoute },
];

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {routeConfig.map(({ path, element, wrapper: Wrapper }) => (
          <Route key={path} path={path} element={<Wrapper>{element}</Wrapper>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
