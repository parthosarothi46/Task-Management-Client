import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { auth } from "../firebase";
import axios from "axios";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import ActivityLog from "./ActivityLog";

const Dashboard = ({ user, darkMode, toggleDarkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${user.uid}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", {
        ...newTask,
        userId: user.uid,
        timestamp: new Date().toISOString(),
      });
      setTasks([...tasks, response.data]);
      addToActivityLog(`Task "${newTask.title}" added to ${newTask.category}`);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      // Send the request to update the task in the backend
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);

      // Update only the changed task in the local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );

      // Log the activity
      addToActivityLog(`Task "${updatedTask.title}" updated`);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      const deletedTask = tasks.find((task) => task._id === taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      addToActivityLog(`Task "${deletedTask?.title}" deleted`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const moveTask = async (taskId, newCategory) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.category === newCategory) return; // Allow moving between all categories

    try {
      // Send request to update the task category in the database
      await axios.put(`http://localhost:5000/api/tasks/move/${taskId}`, {
        category: newCategory,
      });

      // Update the UI state
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === taskId ? { ...t, category: newCategory } : t
        )
      );

      addToActivityLog(`Task "${task.title}" moved to ${newCategory}`);
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const addToActivityLog = (message) => {
    const newEntry = { message, timestamp: new Date().toISOString() };
    setActivityLog([newEntry, ...activityLog.slice(0, 49)]);
  };

  useEffect(() => {
    fetchTasks();
  }, [updateTask]);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="min-h-screen p-4 md:p-6 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome, {user.displayName}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                {darkMode ? "🌞" : "🌙"}
              </button>
              <button
                onClick={() => auth.signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>

          <AddTaskForm addTask={addTask} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {["To-Do", "In Progress", "Done"].map((category) => (
              <TaskList
                key={category}
                category={category}
                tasks={tasks.filter((task) => task.category === category)}
                updateTask={updateTask}
                deleteTask={deleteTask}
                moveTask={moveTask}
                setTasks={setTasks}
              />
            ))}
          </div>

          <ActivityLog log={activityLog} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
