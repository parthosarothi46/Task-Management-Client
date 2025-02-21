import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { format, isPast, isToday } from "date-fns";
import axios from "axios"; // Assuming you use axios for API calls

const Task = ({
  task,
  index,
  updateTask,
  deleteTask,
  moveTask,
  tasks,
  setTasks,
}) => {
  const ref = useRef(null);

  // Drag logic
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task._id, index, category: task.category },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop logic
  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const newCategory = task.category;

      if (dragIndex === hoverIndex || draggedItem.category === newCategory)
        return;

      // Allow tasks to be moved between all categories
      moveTask(draggedItem.id, newCategory);
      draggedItem.index = hoverIndex;
      draggedItem.category = newCategory;
    },
  });

  drag(drop(ref));

  // Date calculations
  const isOverdue =
    task.dueDate &&
    isPast(new Date(task.dueDate)) &&
    !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const updateTaskTitle = (taskId, newTitle) => {
    // Ensure the task is correctly updated without affecting others
    const updatedTasks = tasks.map((t) =>
      t._id === taskId ? { ...t, title: newTitle } : t
    );

    // Update state with all tasks, including the updated one
    setTasks(updatedTasks);

    // Update the backend with the new task title
    axios
      .put(`http://localhost:5000/api/tasks/${taskId}`, { title: newTitle })
      .then((response) => {
        console.log("Task title updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating task title:", error);
        // Optional: Revert the task update if the API call fails
      });
  };

  return (
    <div
      ref={ref}
      className={`
        bg-white dark:bg-gray-600 p-4 rounded-lg shadow cursor-move transition-opacity
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${isOverdue ? "border-l-4 border-red-500" : ""}
        ${isDueToday ? "border-l-4 border-yellow-500" : ""}
      `}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <p
            className={`text-xs ${
              isOverdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created: {format(new Date(task.timestamp), "MMM dd, yyyy HH:mm")}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              if (!task?._id) {
                console.error("Error: Task ID is missing!", task);
                return;
              }
              const newTitle = prompt("Edit Task Title:", task.title);
              if (newTitle && newTitle.trim() !== "") {
                updateTaskTitle(task._id, newTitle); // Call the function here
              }
            }}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>

          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this task?")
              ) {
                deleteTask(task._id);
              }
            }}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;
