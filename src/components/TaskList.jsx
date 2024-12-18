import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSearch,
  faUser,
  faUserPlus,
  faClipboardList,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal from '../pages/Modal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const tasksPerPage = 6;

  const currentUserId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      if (response.data) {
        const userTasks = response.data.filter(
          (task) => task.creator_id === currentUserId || task.assignee_id === currentUserId
        );
        setTasks(userTasks);
      } else {
        setTasks([]);
        toast.info('No tasks found');
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task. Please try again.');
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

  const NoTasksMessage = () => (
    <div className="col-12">
      <div className="card shadow-sm border-0 p-5">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faClipboardList}
            className="text-muted mb-4"
            style={{ fontSize: '4rem' }}
          />
          <h3 className="mb-3">No Tasks Found</h3>

          {searchTerm || statusFilter !== 'All' ? (
            <div>
              <p className="text-muted mb-4">
                No tasks match your current filters. Try adjusting your search criteria or clearing
                filters.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                  }}
                >
                  Clear Filters
                </button>
                <Link to="/add-task" className="btn btn-primary">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create New Task
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-muted mb-4">
                You don't have any tasks yet. Start by creating your first task!
              </p>
              <Link to="/add-task" className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create New Task
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TaskCard = ({ task }) => (
    <div className="card h-100 shadow-sm border-0 hover-shadow">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title text-truncate mb-0 me-2">{task.title}</h5>
          <span className={getStatusBadgeClass(task.status)}>{formatStatus(task.status)}</span>
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

          <div className="d-flex align-items-center mb-2">
            <span className="text-muted me-2">Due Date:</span>
            <span>
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not specified'}
            </span>
          </div>

          <div className="border-top pt-2 mt-2">
            {task.creator_id !== currentUserId && (
              <div className="d-flex align-items-center mb-2">
                <FontAwesomeIcon icon={faUser} className="text-primary me-2" />
                <span className="text-muted me-2">From:</span>
                <span className="text-primary">
                  {task.creator?.nama} ({task.creator?.username})
                </span>
              </div>
            )}

            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUserPlus} className="text-success me-2" />
              <span className="text-muted me-2">
                {task.creator_id === currentUserId ? 'Assigned to:' : 'Also assigned to:'}
              </span>
              <span className="text-success">
                {task.assignee ? `${task.assignee.nama} (${task.assignee.username})` : 'Unassigned'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer bg-white p-3">
        <div className="d-flex justify-content-end gap-3">
          <Link to={`/edit-task/${task.id}`} className="btn btn-link text-warning p-0">
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          {task.creator_id === currentUserId && (
            <DeleteConfirmationModal onConfirm={() => handleDelete(task.id)} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-container">
      <div className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-5"></div>

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
          ) : filteredTasks.length === 0 ? (
            <NoTasksMessage />
          ) : (
            currentTasks.map((task) => (
              <div key={task.id} className="col-md-6 col-lg-4">
                <TaskCard task={task} />
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
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
