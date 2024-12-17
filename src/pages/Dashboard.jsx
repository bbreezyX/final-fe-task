import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks,
  faListCheck,
  faSpinner,
  faCheckDouble,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  // Initial state with fallback data
  const initialStats = {
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    overdueTasks: 0,
  };

  const [taskStats, setTaskStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await getTasks();
      const tasks = response.data;

      if (!tasks || tasks.length === 0) {
        handleFallbackData();
        return;
      }

      const currentDate = new Date();

      const stats = {
        totalTasks: tasks.length,
        todo: tasks.filter((task) => task.status === 'todo').length,
        inProgress: tasks.filter((task) => task.status === 'in_progress').length,
        done: tasks.filter((task) => task.status === 'done').length,
        highPriority: tasks.filter((task) => task.priority === 'high').length,
        mediumPriority: tasks.filter((task) => task.priority === 'medium').length,
        lowPriority: tasks.filter((task) => task.priority === 'low').length,
        overdueTasks: tasks.filter((task) => {
          const dueDate = new Date(task.due_date);
          return dueDate < currentDate && task.status !== 'done';
        }).length,
      };

      setTaskStats(stats);
      setIsUsingFallback(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      handleFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackData = () => {
    // Sample data when API fails
    setTaskStats({
      totalTasks: 6,
      todo: 2,
      inProgress: 3,
      done: 1,
      highPriority: 2,
      mediumPriority: 3,
      lowPriority: 1,
      overdueTasks: 1,
    });
    setIsUsingFallback(true);
    toast.info('Using sample dashboard data');
  };

  const getProgressPercentage = () => {
    if (taskStats.totalTasks === 0) return 0;
    return Math.round((taskStats.done / taskStats.totalTasks) * 100);
  };

  const DashboardCard = ({ title, value, icon, color, subtitle }) => (
    <div className="col-md-3 mb-4">
      <div className={`card shadow-sm border-0 h-100`}>
        <div className={`card-body ${color}`}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="card-title text-white mb-1">{title}</h6>
              <h2 className="text-white mb-0">{value}</h2>
              {subtitle && <small className="text-white-50">{subtitle}</small>}
            </div>
            <FontAwesomeIcon icon={icon} className="text-white-50 fa-2x" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {isUsingFallback && (
        <div className="alert alert-info text-center mb-4">
          Currently displaying sample data. API connection not available.
        </div>
      )}

      <h1 className="title text-center mb-4">Task Dashboard</h1>

      <div className="row">
        <DashboardCard
          title="Total Tasks"
          value={taskStats.totalTasks}
          icon={faTasks}
          color="bg-primary"
          subtitle={`${getProgressPercentage()}% Completed`}
        />
        <DashboardCard title="To Do" value={taskStats.todo} icon={faListCheck} color="bg-warning" />
        <DashboardCard
          title="In Progress"
          value={taskStats.inProgress}
          icon={faSpinner}
          color="bg-info"
        />
        <DashboardCard
          title="Completed"
          value={taskStats.done}
          icon={faCheckDouble}
          color="bg-success"
        />
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Priority Distribution</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-center">
                  <div className="badge bg-danger p-2 mb-2">{taskStats.highPriority}</div>
                  <div>High</div>
                </div>
                <div className="text-center">
                  <div className="badge bg-warning p-2 mb-2">{taskStats.mediumPriority}</div>
                  <div>Medium</div>
                </div>
                <div className="text-center">
                  <div className="badge bg-success p-2 mb-2">{taskStats.lowPriority}</div>
                  <div>Low</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Overdue Tasks</h5>
                  <h3 className="mb-0">{taskStats.overdueTasks}</h3>
                </div>
                <FontAwesomeIcon icon={faExclamationTriangle} className="fa-2x text-white-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
