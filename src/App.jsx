import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage on first render
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "completed") return t.completed;
    if (filter === "active") return !t.completed;
    return true;
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 p-4">
      <h1 className="text-4xl font-bold text-blue-600">Task Manager</h1>

      <div className="flex gap-2">
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task..."
          className="w-64"
        />
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>

      <Tabs defaultValue="all" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="active" onClick={() => setFilter("active")}>
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter("completed")}>
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <div className="mt-4 flex flex-col gap-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between border p-3 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={t.completed}
                      onCheckedChange={() => toggleTask(t.id)}
                    />
                    <span
                      className={t.completed ? "line-through text-gray-500" : ""}
                    >
                      {t.text}
                    </span>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTask(t.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No tasks here!</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
