import { useDrop } from "react-dnd";
import Task from "./Task";

const TaskList = ({
  category,
  tasks,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  setTasks,
}) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.category !== category) {
        moveTask(item.id, category);
      }
    },
  });

  const handleReorder = (dragIndex, hoverIndex) => {
    reorderTasks(category, dragIndex, hoverIndex);
  };

  return (
    <div
      ref={drop}
      className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        {category}
      </h2>
      <div className="space-y-3 min-h-[400px]">
        {tasks
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((task, index) => (
            <Task
              key={task._id}
              task={task}
              tasks={tasks}
              index={index}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onReorder={handleReorder}
              setTasks={setTasks}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskList;
