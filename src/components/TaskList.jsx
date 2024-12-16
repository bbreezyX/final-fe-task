import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then((response) => setTasks(response.data))
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch tasks');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    deleteTask(id)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.error('Task berhasil didelete!');
      })
      .catch((error) => {
        console.error(error);
        toast.warning('Failed to delete task!');
      });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  // Logic untuk pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const formatStatus = (status) => {
    const statusMap = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container mt-5">
      <h1 className="title text-center mb-4">Task List</h1>
      <div className="mb-4 d-flex justify-content-center">
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-3"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className="row">
        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <div className="col-md-4 mb-4" key={task.id}>
              <div className="card shadow">
                <div className={`card-header text-white bg-dashboard `}>
                  <h5 className="card-title mb-0">{task.title}</h5>
                </div>
                <div className="card-body">
                  <p>{task.description}</p>
                  <p>
                    <strong>Status:</strong> {formatStatus(task.status)}
                  </p>
                  <p>
                    <strong>Priority:</strong> {formatStatus(task.priority)}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {task.dueDate || 'Not specified'}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <Link to={`/edit-task/${task.id}`} className="icon-btn text-warning">
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <button className="icon-btn text-danger" onClick={() => handleDelete(task.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4">No tasks found.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination-container">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`pagination-button ${index + 1 === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
