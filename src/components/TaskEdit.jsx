import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTasks, updateTask } from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faListAlt,
  faCalendarAlt,
  faArrowRight,
  faArrowLeft,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assignee_username: '',
    due_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const response = await getTasks();
      const task = response.data.find((t) => t.id === parseInt(id));
      if (task) {
        setForm({
          ...task,
          assignee_username: task.assignee_username || '',
        });
      } else {
        toast.error('Task not found');
        navigate('/task');
      }
    } catch (error) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task');
      navigate('/task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...form,
        assignee_username: form.assignee_username || null,
        due_date: form.due_date || null,
      };

      await updateTask(id, dataToSubmit);
      toast.success('Task berhasil diupdate!');
      navigate('/task');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Gagal mengupdate task');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="stepper-container">
      <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>Basic Info</span>
      </div>
      <div className={`stepper-line ${currentStep >= 2 ? 'active' : ''}`}></div>
      <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faListAlt} />
        <span>Details</span>
      </div>
      <div className={`stepper-line ${currentStep >= 3 ? 'active' : ''}`}></div>
      <div className={`stepper-step ${currentStep === 3 ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>Schedule</span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Information</h3>
            <div className="form-group">
              <input
                type="text"
                className="step-input"
                placeholder="Task Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
              <textarea
                className="step-input"
                placeholder="Task Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h3>Task Details</h3>
            <div className="form-group">
              <select
                className="step-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select
                className="step-input"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h3>Schedule</h3>
            <div className="form-group">
              <input
                type="text"
                className="step-input"
                placeholder="Assignee Username (Optional)"
                name="assignee_username"
                value={form.assignee_username}
                onChange={handleChange}
              />
              <input
                type="date"
                className="step-input"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="form-wrapper">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="stepper-form-container">
        <h2 className="text-center mb-4">Edit Task</h2>
        {form.title && (
          <div className="alert alert-info text-center mb-4">Editing: {form.title}</div>
        )}
        <StepIndicator />
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          <div className="stepper-buttons">
            {currentStep > 1 && (
              <button
                type="button"
                className="step-button back"
                onClick={() => setCurrentStep((curr) => curr - 1)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                className="step-button next"
                onClick={() => setCurrentStep((curr) => curr + 1)}
                disabled={loading}
              >
                Next <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button type="submit" className="step-button submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} /> Update Task
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEdit;
