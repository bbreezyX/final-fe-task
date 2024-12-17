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
  const [loading, setLoading] = useState(true);
  const tasksPerPage = 6;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Task berhasil dihapus!');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

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

  const getStatusColor = (status) => {
    const colorMap = {
      todo: 'bg-warning',
      in_progress: 'bg-info',
      done: 'bg-success',
    };
    return colorMap[status] || 'bg-secondary';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      low: 'text-success',
      medium: 'text-warning',
      high: 'text-danger',
    };
    return colorMap[priority] || 'text-secondary';
  };

  return (
    <div className="container mt-5">
      <h1 className="title text-center mb-4">Task List</h1>
      <div className="mb-4 d-flex justify-content-center">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
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
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <div className="col-md-4 mb-4" key={task.id}>
              <div className="card h-100 shadow-sm">
                <div className={`card-header ${getStatusColor(task.status)} text-white`}>
                  <h5 className="card-title mb-0">{task.title}</h5>
                </div>
                <div className="card-body d-flex flex-column" style={{ minHeight: '200px' }}>
                  <p className="description-container overflow-auto mb-3">{task.description}</p>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    <span className={`badge ${getStatusColor(task.status)}`}>
                      {formatStatus(task.status)}
                    </span>
                  </p>
                  <p className="mb-1">
                    <strong>Priority:</strong>{' '}
                    <span className={getPriorityColor(task.priority)}>
                      {formatStatus(task.priority)}
                    </span>
                  </p>
                  <p className="mb-0">
                    <strong>Due Date:</strong>{' '}
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <Link to={`/edit-task/${task.id}`} className="btn btn-sm btn-outline-warning">
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center mt-4">No tasks found.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TaskList;
