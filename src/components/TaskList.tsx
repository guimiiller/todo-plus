"use client";

import { useState, FormEvent } from "react";
import { Task } from "@/types/Task";

type TaskListProps = {
  initialTasks: Task[];
  addTask: (title: string, category: string) => Promise<Task>;
  updateTask: (id: string, title: string, category: string) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
};

export default function TaskList({
  initialTasks,
  addTask,
  updateTask,
  deleteTask,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<string>("all");
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString() || "";
    const category = formData.get("category")?.toString() || "other";

    if (title) {
      const newTask = await addTask(title, category);
      setTasks((prev) => [...prev, newTask]);
      form.reset();
    }
  };

  const handleEditTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedTitle = formData.get("title")?.toString() || "";
    const updatedCategory = formData.get("category")?.toString() || "other";

    if (editTask && updatedTitle) {
      const updatedTask = await updateTask(editTask.id, updatedTitle, updatedCategory);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditTask(null);
      form.reset();
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : task.category === filter
  );

  return (
    <div className="flex items-center justify-center flex-col max-w-5xl w-full p-4">
      <div className="my-4 flex flex-wrap justify-center gap-2">
        {["all", "work", "personal", "other"].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-md transition ${
              filter === category
                ? "bg-slate-600 text-white"
                : "bg-slate-800 text-gray-300"
            } hover:bg-slate-700`}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <form
        onSubmit={editTask ? handleEditTask : handleAddTask}
        className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6"
      >
        <input
          name="title"
          type="text"
          placeholder="Task title"
          defaultValue={editTask?.title || ""}
          className="flex-1 border border-slate-800 bg-transparent py-2 px-4 outline-none text-white placeholder:text-gray-400"
        />
        <select
          name="category"
          defaultValue={editTask?.category || "other"}
          className="border p-2 border-slate-800 bg-transparent text-white outline-none"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition"
        >
          {editTask ? "Update" : "Add"}
        </button>
      </form>

      <ul className="text-white mt-6 w-full">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-4 bg-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 m-2 rounded-md"
          >
            <div>
              <span className="font-semibold">{task.title}</span> -{" "}
              <span className="text-gray-400">{task.category}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setEditTask(task)}
                className="text-blue-400 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-400 hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
