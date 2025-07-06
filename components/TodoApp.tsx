'use client';

import { useState, useEffect, useTransition } from 'react';
import { Task } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addTask, deleteTask } from '@/app/actions/tasks';

interface TodoAppProps {
  initialTasks: Task[];
}

export default function TodoApp({ initialTasks }: TodoAppProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isPending, startTransition] = useTransition();

  // Keep tasks in sync with server data
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const newTask = {
      id: tempId,
      title: newTaskTitle,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: null,
      dueDate: null
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    
    try {
      const result = await addTask(newTaskTitle);
      if (result.success && result.task) {
        // Replace temp task with real task from server
        setTasks(prev => prev.map(t => t.id === tempId ? result.task! : t));
      }
    } catch (error) {
      // Revert on failure
      setTasks(prev => prev.filter(t => t.id !== tempId));
      alert('Failed to add task');
    }
  };

  const handleDeleteTask = (id: string) => {
    // Optimistic UI update
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    
    startTransition(async () => {
      try {
        const result = await deleteTask(id);
        if (!result.success) {
          // Revert on failure
          if (taskToDelete) setTasks(prev => [...prev, taskToDelete]);
        }
      } catch (error) {
        if (taskToDelete) setTasks(prev => [...prev, taskToDelete]);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo App</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button 
          onClick={handleAddTask}
          disabled={!newTaskTitle.trim()}
        >
          Add
        </Button>
      </div>
      
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li 
            key={task.id} 
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.title}
            </span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              disabled={isPending}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && (
        <p className="text-center text-gray-500 py-4">No tasks yet. Add one!</p>
      )}
    </div>
  );
}

