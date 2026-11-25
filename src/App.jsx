import { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Add or Update Task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    if (editingTaskId !== null) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, text: taskText.trim(), dateTime }
            : task
        )
      );

      setEditingTaskId(null);
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        text: taskText.trim(),
        dateTime: dateTime,
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    setTaskText('');
    setDateTime('');
  };

  // Mark Task as Complete / Incomplete
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Edit Task
  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);

    if (taskToEdit) {
      setTaskText(taskToEdit.text);
      setDateTime(taskToEdit.dateTime || '');
      setEditingTaskId(id);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setTaskText('');
    setDateTime('');
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editingTaskId === id) {
      handleCancelEdit();
    }
  };

  // Format Date and Time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';

    const date = new Date(dateTimeStr);

    if (isNaN(date.getTime())) {
      return dateTimeStr.replace('T', ' ');
    }

    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="app-container">
      <div className="todo-card">

        <header className="todo-header">
          <h1>To-Do List</h1>
        </header>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="task-form">

          <div className="form-group task-group">
            <label htmlFor="task-input">Task</label>

            <input
              id="task-input"
              type="text"
              placeholder="Enter Task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              required
            />
          </div>

          <div className="form-group date-group">
            <label htmlFor="datetime-input">
              Completion Date & Time
            </label>

            <input
              id="datetime-input"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="add-task-btn">
              {editingTaskId !== null ? 'Update Task' : 'Add Task'}
            </button>

            {editingTaskId !== null && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Task List */}
        <div className="tasks-section">

          {tasks.length === 0 ? (
            <p className="empty-message">No tasks yet.</p>
          ) : (
            <ul className="task-list">

              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  className={`task-item ${
                    task.completed ? 'completed' : ''
                  }`}
                >

                  <div className="task-info">
                    <span className="task-title">
                      {task.text}
                    </span>

                    {task.dateTime && (
                      <span className="task-due-time">
                        🕒 Due: {formatDateTime(task.dateTime)}
                      </span>
                    )}
                  </div>

                  <div className="task-actions">

                    {/* Complete Button */}
                    <button
                      type="button"
                      className="btn-complete"
                      onClick={() => handleToggleComplete(task.id)}
                    >
                      {task.completed
                        ? 'Completed'
                        : 'Mark as Complete'}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => handleEditTask(task.id)}
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>

                  </div>
                </li>
              ))}

            </ul>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;