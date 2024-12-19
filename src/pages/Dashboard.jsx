import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks,
  faListCheck,
  faSpinner,
  faCheckDouble,
  faExclamationTriangle,
  faInfoCircle,
  faUser,
  faTag,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-4" role="alert">
          <h4 className="alert-heading">Something went wrong!</h4>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Tooltip Component
const Tooltip = ({ children, content }) => (
  <div className="position-relative d-inline-block" data-bs-toggle="tooltip" title={content}>
    {children}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="main-container">
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: '60vh' }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
);

const DASHBOARD_CARDS = [
  {
    id: 'total',
    title: 'Total Tasks',
    icon: faTasks,
    bgClass: 'bg-primary',
    tooltip: 'Total number of tasks in your list',
    getValue: (stats) => ({
      value: stats.totalTasks,
      subtitle: `${stats.progressPercentage}% Completed`,
    }),
  },
  {
    id: 'todo',
    title: 'To Do',
    icon: faListCheck,
    bgClass: 'bg-warning',
    tooltip: 'Tasks that need to be started',
    getValue: (stats) => ({
      value: stats.todo,
    }),
  },
  {
    id: 'progress',
    title: 'In Progress',
    icon: faSpinner,
    bgClass: 'bg-info',
    tooltip: 'Tasks currently being worked on',
    getValue: (stats) => ({
      value: stats.inProgress,
    }),
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: faCheckDouble,
    bgClass: 'bg-success',
    tooltip: 'Tasks that have been completed',
    getValue: (stats) => ({
      value: stats.done,
    }),
  },
];

const DashboardCard = ({ title, value, icon, bgClass, subtitle, tooltip, onClick }) => (
  <div className="col-md-3 mb-4">
    <div
      className="card border-0 h-100 shadow-sm hover:shadow-lg cursor-pointer"
      onClick={onClick}
      style={{ transition: 'all 0.3s ease' }}
    >
      <div className={`card-body ${bgClass} rounded`}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Tooltip content={tooltip}>
              <h6 className="card-title text-white mb-1 d-flex align-items-center">
                {title}
                <FontAwesomeIcon icon={faInfoCircle} className="ms-2" size="sm" />
              </h6>
            </Tooltip>
            <h2 className="text-white mb-0 fw-bold">
              {value !== undefined ? value : <FontAwesomeIcon icon={faSpinner} spin />}
            </h2>
            {subtitle && <small className="text-white-50">{subtitle}</small>}
          </div>
          <div className="bg-white bg-opacity-25 p-3 rounded">
            <FontAwesomeIcon icon={icon} className="text-white" style={{ fontSize: '24px' }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PriorityCard = ({ title, value, colorClass, bgClass, onClick, isLoading }) => (
  <div className="col-md-4 mb-3 mb-md-0 text-center cursor-pointer" onClick={onClick}>
    <div className="card h-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="card-body">
        <h6 className={`${colorClass} mb-2 fw-semibold`}>{title}</h6>
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} spin className={colorClass} />
        ) : (
          <div className={`badge ${bgClass} p-2 fs-5`}>{value}</div>
        )}
      </div>
    </div>
  </div>
);

const TaskDetailModal = ({ isOpen, onClose, tasks, title }) => {
  if (!isOpen) return null;

  const formatAssignee = (assignee) => {
    if (!assignee) return 'Unassigned';
    if (typeof assignee === 'object') {
      return assignee.nama || assignee.username || 'Unassigned';
    }
    return assignee;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            {/* Modal Header */}
            <div className="modal-header border-bottom bg-light">
              <div className="d-flex align-items-center">
                <h5 className="modal-title fw-bold text-primary mb-0">{title}</h5>
                <span className="badge bg-primary ms-2 rounded-pill">
                  {tasks?.length || 0} Tasks
                </span>
              </div>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {tasks && tasks.length > 0 ? (
                <div className="row g-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          {/* Task Header */}
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title fw-bold mb-0">{task.title}</h6>
                            <div className="d-flex gap-2">
                              <span
                                className={`badge ${
                                  task.status === 'todo'
                                    ? 'bg-warning'
                                    : task.status === 'in_progress'
                                      ? 'bg-info'
                                      : 'bg-success'
                                }`}
                              >
                                {task.status?.replace('_', ' ').toUpperCase()}
                              </span>
                              <span
                                className={`badge ${
                                  task.priority === 'high'
                                    ? 'bg-danger'
                                    : task.priority === 'medium'
                                      ? 'bg-warning'
                                      : 'bg-success'
                                }`}
                              >
                                {task.priority?.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Task Description */}
                          <p className="card-text text-muted mb-3">
                            {task.description || 'No description provided'}
                          </p>

                          {/* Task Footer */}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                              <small className="text-muted">
                                <FontAwesomeIcon icon={faUser} className="me-1" />
                                {formatAssignee(task.assignee)}
                              </small>
                              {task.category && (
                                <small className="text-muted">
                                  <FontAwesomeIcon icon={faTag} className="me-1" />
                                  {task.category}
                                </small>
                              )}
                            </div>
                            <small className="text-muted">
                              <FontAwesomeIcon icon={faCalendar} className="me-1" />
                              Due: {formatDate(task.due_date)}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <h6 className="text-muted">No tasks found</h6>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-top bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

const calculateStats = (tasks) => {
  if (!Array.isArray(tasks)) return null;

  const currentDate = new Date();
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((task) => task.status.toLowerCase() === 'in_progress');
  const doneTasks = tasks.filter((task) => task.status.toLowerCase() === 'done');
  const todoTasks = tasks.filter((task) => task.status.toLowerCase() === 'todo');

  return {
    totalTasks,
    todo: todoTasks.length,
    inProgress: inProgressTasks.length,
    done: doneTasks.length,
    highPriority: tasks.filter((task) => task.priority === 'high').length,
    mediumPriority: tasks.filter((task) => task.priority === 'medium').length,
    lowPriority: tasks.filter((task) => task.priority === 'low').length,
    overdueTasks: tasks.filter((task) => {
      try {
        const dueDate = new Date(task.due_date);
        return dueDate < currentDate && task.status !== 'done';
      } catch (error) {
        return false;
      }
    }).length,
    progressPercentage: totalTasks === 0 ? 0 : Math.round((doneTasks.length / totalTasks) * 100),
  };
};

const Dashboard = () => {
  const initialStats = {
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    overdueTasks: 0,
    progressPercentage: 0,
  };

  const [taskStats, setTaskStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [selectedTasks, setSelectedTasks] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getTasks();
        if (!response?.data) throw new Error('Invalid response format');

        const stats = calculateStats(response.data);
        if (!stats) throw new Error('Failed to calculate statistics');

        setTaskStats(stats);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    try {
      const nama = localStorage.getItem('nama') || '';
      setUserName(nama || 'User');
      setGreeting(getGreeting());

      const intervalId = setInterval(() => {
        setGreeting(getGreeting());
      }, 60000);

      loadDashboardData();

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('Error in dashboard initialization:', error);
      setError(error.message || 'Failed to initialize dashboard');
    }
  }, []);

  const handleCardClick = (type, title) => {
    try {
      let filteredTasks;
      switch (type) {
        case 'todo':
          filteredTasks = tasks.filter((task) => task.status.toLowerCase() === 'todo');
          break;
        case 'progress':
          filteredTasks = tasks.filter((task) => task.status.toLowerCase() === 'in_progress');
          break;
        case 'completed':
          filteredTasks = tasks.filter((task) => task.status.toLowerCase() === 'done');
          break;
        case 'high':
          filteredTasks = tasks.filter((task) => task.priority === 'high');
          break;
        case 'medium':
          filteredTasks = tasks.filter((task) => task.priority === 'medium');
          break;
        case 'low':
          filteredTasks = tasks.filter((task) => task.priority === 'low');
          break;
        case 'overdue':
          filteredTasks = tasks.filter((task) => {
            try {
              const dueDate = new Date(task.due_date);
              return dueDate < new Date() && task.status !== 'done';
            } catch {
              return false;
            }
          });
          break;
        default:
          filteredTasks = tasks;
      }
      setSelectedTasks(filteredTasks);
      setModalTitle(title);
      setModalOpen(true);
    } catch (error) {
      console.error('Error filtering tasks:', error);
      setError('Failed to filter tasks');
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Error loading dashboard: {error}
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="main-container bg-light">
      <div className="container py-4">
        <div className="text-center mb-5">
          <h5 className="text-muted mb-2">{greeting}</h5>
          <h1 className="fw-bold">{userName}</h1>
          <p className="text-muted">Here's your task overview for today</p>
        </div>

        {/* Main Stats Cards */}
        <div className="row mb-4">
          {DASHBOARD_CARDS.map((card) => {
            const { value, subtitle } = card.getValue(taskStats);
            return (
              <DashboardCard
                key={card.id}
                title={card.title}
                value={value}
                icon={card.icon}
                bgClass={card.bgClass}
                subtitle={subtitle}
                tooltip={card.tooltip}
                onClick={() => handleCardClick(card.id, card.title)}
              />
            );
          })}
        </div>

        {/* Priority and Overdue Section */}
        <div className="row">
          {/* Priority Distribution */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="card-title mb-0 fw-semibold text-center mt-1">
                  Priority Distribution
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <PriorityCard
                    title="High Priority"
                    value={taskStats.highPriority}
                    colorClass="text-danger"
                    bgClass="bg-danger"
                    isLoading={loading}
                    onClick={() => handleCardClick('high', 'High Priority Tasks')}
                  />
                  <PriorityCard
                    title="Medium Priority"
                    value={taskStats.mediumPriority}
                    colorClass="text-warning"
                    bgClass="bg-warning"
                    isLoading={loading}
                    onClick={() => handleCardClick('medium', 'Medium Priority Tasks')}
                  />
                  <PriorityCard
                    title="Low Priority"
                    value={taskStats.lowPriority}
                    colorClass="text-success"
                    bgClass="bg-success"
                    isLoading={loading}
                    onClick={() => handleCardClick('low', 'Low Priority Tasks')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Tasks Card */}
          <div className="col-lg-4 mb-4">
            <div
              className="card shadow-sm border-0 cursor-pointer hover:shadow-lg"
              onClick={() => handleCardClick('overdue', 'Overdue Tasks')}
            >
              <div className="card-body bg-danger rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="text-white mb-1">Overdue Tasks</h5>
                    <h3 className="text-white mb-1 fw-bold">
                      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : taskStats.overdueTasks}
                    </h3>
                    <small className="text-white-50">Tasks past due date</small>
                  </div>
                  <div className="bg-white bg-opacity-25 p-3 rounded">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-white"
                      style={{ fontSize: '28px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tasks={selectedTasks}
          title={modalTitle}
        />
      </div>
    </div>
  );
};

// Wrap dashboard with ErrorBoundary
export default function DashboardWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
