import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const TaskForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigneeId: '',
    dueDate: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...form,
        assigneeId: form.assigneeId ? parseInt(form.assigneeId, 10) : null,
        dueDate: form.dueDate || null,
      };
      await createTask(dataToSubmit);
      toast.success('Task berhasil ditambah!');
      navigate('/task');
    } catch (error) {
      toast.error('Gagal menambahkan task.');
    }
  };

  return (
    <div className="custom-container">
      <div className="custom-card">
        <h2 className="custom-card-title">Add New Task</h2>
        <form onSubmit={handleSubmit} className="custom-form">
          <div className="custom-form-group">
            <label htmlFor="title" className="custom-label">
              Title
            </label>
            <input
              type="text"
              className="custom-input"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="description" className="custom-label">
              Description
            </label>
            <textarea
              className="custom-input"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="status" className="custom-label">
              Status
            </label>
            <select
              className="custom-input"
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
          <div className="custom-form-group">
            <label htmlFor="priority" className="custom-label">
              Priority
            </label>
            <select
              className="custom-input"
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="custom-form-group">
            <label htmlFor="assigneeId" className="custom-label">
              Assignee ID (Optional)
            </label>
            <input
              type="number"
              className="custom-input"
              id="assigneeId"
              name="assigneeId"
              value={form.assigneeId} // Nilai tetap string kosong jika null
              onChange={(e) =>
                setForm({
                  ...form,
                  assigneeId: e.target.value !== '' ? e.target.value : '',
                })
              }
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="dueDate" className="custom-label">
              Due Date (Optional)
            </label>
            <input
              type="date"
              className="custom-input"
              id="dueDate"
              name="dueDate"
              value={form.dueDate} // Nilai tetap string kosong jika null
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: e.target.value !== '' ? e.target.value : '',
                })
              }
            />
          </div>
          <div className="custom-button-group">
            <button type="submit" className="custom-button primary">
              Add Task
            </button>
            <button
              type="button"
              className="custom-button secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
