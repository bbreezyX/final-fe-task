import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTasks, updateTask } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTasks()
      .then((response) => {
        const task = response.data.find((t) => t.id === parseInt(id));
        setForm(task);
        f;
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(id, form)
      .then(() => {
        toast.success('Task berhasil diedit!');
        navigate('/task');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Gagal mengedit task list!');
      });
  };

  if (!form) return <div>Loading...</div>; // Loading saat data belum siap

  return (
    <div className="custom-container">
      <div className="custom-card">
        <h2 className="custom-card-title">Edit Task</h2>
        <form onSubmit={handleSubmit} className="custom-form">
          <div className="custom-form-group">
            <label htmlFor="title" className="custom-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="custom-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="description" className="custom-label">
              Description
            </label>
            <textarea
              id="description"
              className="custom-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="status" className="custom-label">
              Status
            </label>
            <select
              id="status"
              className="custom-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="custom-form-group">
            <label htmlFor="priority" className="custom-label">
              Priority
            </label>
            <select
              id="priority"
              className="custom-input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="" disabled>
                Select priority
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="custom-form-group">
            <label htmlFor="due_date" className="custom-label">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              className="custom-input"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </div>
          <div className="custom-button-group">
            <button type="submit" className="custom-button primary">
              Update Task
            </button>
            <button
              type="button"
              className="custom-button secondary"
              onClick={() => navigate('/task')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEdit;
