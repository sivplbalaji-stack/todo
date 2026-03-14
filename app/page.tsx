"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

/* ---------- Custom Hook ---------- */
const useInputFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return { inputRef, focusInput };
};

/* ---------- Task Item Component ---------- */
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <li className="flex justify-between items-center bg-gray-50 p-2 rounded">
      <span
        onClick={() => onToggle(task.id)}
        className={`cursor-pointer ${
          task.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {task.text}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </li>
  );
};

/* ---------- Main Page ---------- */
export default function Home() {
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const { inputRef, focusInput } = useInputFocus();

  /* Load tasks */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) setTasks(JSON.parse(stored));
    } catch {
      console.error("Failed to load tasks");
    }

    focusInput();
  }, [focusInput]);

  /* Save tasks */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* Add task */
  const addTask = () => {
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
    focusInput();
  };

  /* Delete task */
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /* Toggle task */
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="bg-white p-6 rounded-lg shadow-lg w-96">

        <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-4 py-2 border rounded-md flex-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task..."
          />

          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>

      </main>
    </div>
  );
}