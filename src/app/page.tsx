import TaskList from "@/components/TaskList";
import { getTasks, addTask, updateTask, deleteTask } from "./tasks/actions";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="p-6 flex items-center justify-center flex-col max-w-full">
      <h1 className="text-3xl font-bold">Task Manager</h1>
      <TaskList
        initialTasks={tasks}
        addTask={addTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}
