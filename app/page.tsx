import TodoApp from "@/components/TodoApp";
import { getTasks } from "@/app/actions/tasks";

export default async function Home() {
  const tasks = await getTasks();
  return <TodoApp initialTasks={tasks} />;
}

