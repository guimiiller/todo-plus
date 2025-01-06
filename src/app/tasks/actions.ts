"use server";

import { Task } from "@/types/Task";

let tasks: Task[] = [
  { id: "1", title: "Exemplo Tarefa", category: "work", completed: false },
];

// Recuperar tarefas
export async function getTasks(): Promise<Task[]> {
  return tasks;
}


export async function addTask(title: string, category: string): Promise<Task> {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title,
    category,
    completed: false,
  };
  tasks.push(newTask);
  return newTask;
}


export async function updateTask(
  id: string,
  title: string,
  category: string
): Promise<Task> {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.title = title;
    task.category = category;
  }
  return task!;
}


export async function deleteTask(id: string): Promise<void> {
  tasks = tasks.filter((task) => task.id !== id);
}
