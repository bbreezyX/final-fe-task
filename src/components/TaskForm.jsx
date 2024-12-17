import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/api';
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

const TaskForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee_id: '',
    due_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...form,
        assignee_id: form.assignee_id ? parseInt(form.assignee_id, 10) : null,
        due_date: form.due_date || null,
      };

      await createTask(dataToSubmit);
      toast.success('Task berhasil ditambah!');
      navigate('/task');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Gagal menambahkan task.');
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
                type="number"
                className="step-input"
                placeholder="Assignee ID (Optional)"
                name="assignee_id"
                value={form.assignee_id}
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

  return (
    <div className="form-wrapper">
      <div className="stepper-form-container">
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
                    Creating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} /> Create Task
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

export default TaskForm;
