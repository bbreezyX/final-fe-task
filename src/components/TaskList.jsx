import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClipboardList, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal from '../pages/Modal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      if (response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks. Please try again later.');
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
            filteredTasks.map((task) => (
              <div key={task.id} className="col-md-6 col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text">{task.description}</p>
                    <div className="d-flex justify-content-end">
                      <DeleteConfirmationModal onConfirm={() => handleDelete(task.id)} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
