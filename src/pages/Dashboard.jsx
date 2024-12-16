import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/api'; // Import API function

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
  });

  useEffect(() => {
    getTasks()
      .then((response) => {
        const tasks = response.data;

        const stats = {
          totalTasks: tasks.length,
          todo: tasks.filter((task) => task.status === 'todo').length,
          inProgress: tasks.filter((task) => task.status === 'in_progress').length,
          done: tasks.filter((task) => task.status === 'done').length,
          highPriority: tasks.filter((task) => task.priority === 'high').length,
        };

        setTaskStats(stats);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="container text-center mt-5">
        <h1 className="title">Welcome!</h1>
        <div className="row mt-5">
          <div className="col-md-3">
            <div className="card text-white bg-dashboard mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Tasks</h5>
                <p className="card-text">{taskStats.totalTasks}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-dashboard mb-3">
              <div className="card-body">
                <h5 className="card-title">To Do</h5>
                <p className="card-text">{taskStats.todo}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-dashboard mb-3">
              <div className="card-body">
                <h5 className="card-title">In Progress</h5>
                <p className="card-text">{taskStats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-dashboard mb-3">
              <div className="card-body">
                <h5 className="card-title">Completed</h5>
                <p className="card-text">{taskStats.done}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
