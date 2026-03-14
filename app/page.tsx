"use client"
import React, { useState, useRef, useEffect } from "react";

export interface Task{
  id: number,
  text: String,
  completed: Boolean
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const inpRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    setLoading(true);
    const storedTasks = localStorage.getItem("tasks");
    if(storedTasks){
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks([]);
    }
    inpRef.current?.focus();
    setLoading(false);
  },[]);
  
  const addTask = ()=>{
    if(!input.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: input,
      completed: false
    }

    setTasks([...tasks, newTask]);
    setInput("");
    inpRef.current?.focus();
  }

  const deleteTask= (id:number) =>{
    const taskExists = tasks.some(task=> task.id === id);
    if(!taskExists) return;

    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleTask = (id:number)=>{
    setTasks(
      tasks.map(task =>
        task.id === id
        ? { ...task, completed: !task.completed}
        : task
      )
    )

    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  if(loading){
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="bg-white p-6 rounded-lg shadow-lg w-96">
        
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-2xl font-bold text-center mb-4">ToDo list</h1>
          <div className="flex gap-2">
              <input 
                ref={inpRef}
                type="text" 
                value={input} 
                onChange={(e) =>{setInput(e.target.value)}}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />

              <button 
                onClick={addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Task
              </button>
          </div>

          <ul className="mt-4 space-y-2">
              {
                tasks.map(task => (
                  <li key={task.id} className=" justify-between items-center bg-gray-50 p-2 rounded">
                    <span 
                      onClick={() => toggleTask(task.id)} 
                      className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
                    >
                      {task.text}
                    </span>
                    <button 
                      className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 ml-2" 
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </li>
                  )
                )
              }
            </ul>
          </div>
      </main>
    </div>
  );
}
