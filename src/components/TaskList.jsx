import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal from '../pages/Modal';

const TaskList = () => {
  // Hardcoded data sebagai fallback
  const fallbackTasks = [
    {
      id: 1,
      title: 'Membuat Fitur Login',
      description: 'Implementasi sistem autentikasi menggunakan JWT token',
      status: 'in_progress',
      priority: 'high',
      due_date: '2024-12-25',
    },
    {
      id: 2,
      title: 'Database Design',
      description: 'Merancang struktur database untuk aplikasi task management',
      status: 'todo',
      priority: 'medium',
      due_date: '2024-12-20',
    },
    {
      id: 3,
      title: 'Testing API',
      description: 'Melakukan testing pada semua endpoint API',
      status: 'done',
      priority: 'low',
      due_date: '2024-12-15',
    },
    {
      id: 4,
      title: 'UI/UX Design',
      description: 'Membuat desain antarmuka pengguna yang responsif',
      status: 'todo',
      priority: 'high',
      due_date: '2024-12-18',
    },
    {
      id: 5,
      title: 'Bug Fixing',
      description: 'Memperbaiki bug pada fitur task filtering',
      status: 'in_progress',
      priority: 'medium',
      due_date: '2024-12-22',
    },
    {
      id: 6,
      title: 'Deploy Aplikasi',
      description: 'Melakukan deployment aplikasi ke server production',
      status: 'todo',
      priority: 'high',
      due_date: '2024-12-28',
    },
    {
      id: 7,
      title: 'Deploy Aplikasi',
      description: 'Melakukan deployment aplikasi ke server production',
      status: 'todo',
      priority: 'high',
      due_date: '2024-12-28',
    },
  ];

  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const tasksPerPage = 6;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      if (response.data && response.data.length > 0) {
        setTasks(response.data);
        setIsUsingFallback(false);
      } else {
        setTasks(fallbackTasks);
        setIsUsingFallback(true);
        toast.info('Using sample tasks data');
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks(fallbackTasks);
      setIsUsingFallback(true);
      toast.info('Using sample tasks data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    if (isUsingFallback) {
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Task berhasil dihapus! (Local data)');
      return;
    }

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
    return tasks
      .sort((a, b) => b.id - a.id)
      .filter((task) => {
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

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      todo: 'bg-warning text-dark',
      in_progress: 'bg-info text-white',
      done: 'bg-success text-white',
    };
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const getPriorityClass = (priority) => {
    const priorityClasses = {
      low: 'text-success',
      medium: 'text-warning',
      high: 'text-danger',
    };
    return priorityClasses[priority] || 'text-secondary';
  };

  return (
    <div className="main-container">
      <div className="container pb-5">
        <h1 className="text-center mb-5">Task List</h1>

        {/* Search and Filter Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="d-flex gap-3">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faSearch} className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="row g-4">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '300px' }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            currentTasks.map((task) => (
              <div key={task.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 hover-shadow">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3 title-section">
                      <h5 className="card-title text-truncate mb-0 me-2">{task.title}</h5>
                      <span className={getStatusBadgeClass(task.status)}>
                        {formatStatus(task.status)}
                      </span>
                    </div>

                    <div className="divider"></div>

                    <p
                      className="card-text text-muted mb-3 mt-3"
                      style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        minHeight: '4.5em',
                      }}
                    >
                      {task.description}
                    </p>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-muted me-2">Priority:</span>
                        <span className={`fw-semibold ${getPriorityClass(task.priority)}`}>
                          {formatStatus(task.priority)}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-2">Due Date:</span>
                        <span>
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-white p-3">
                    <div className="d-flex justify-content-end gap-3">
                      <Link to={`/edit-task/${task.id}`} className="btn btn-link text-warning p-0">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <DeleteConfirmationModal onConfirm={() => handleDelete(task.id)} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination with custom styling */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 mb-4">
            <div className="custom-pagination">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span>&lt;</span>
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="pagination-button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span>&gt;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
