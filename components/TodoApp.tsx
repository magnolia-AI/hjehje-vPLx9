'use client';

import { useState } from 'react';
import { Task } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MoreVertical } from 'lucide-react';

export default function TodoApp({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    // This will be replaced with a server action
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskText,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      dueDate: null,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <div>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
              <Checkbox checked={task.completed} onCheckedChange={() => {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
              }} />
              <span className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </span>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>{tasks.filter(t => !t.completed).length} tasks left</span>
          <div>
            <Button variant="ghost" size="sm">All</Button>
            <Button variant="ghost" size="sm">Active</Button>
            <Button variant="ghost" size="sm">Completed</Button>
          </div>
          <Button variant="ghost" size="sm">Clear completed</Button>
        </div>
      </CardContent>
    </Card>
  );
}

