"use client";
import { useEffect, useState } from "react";
import { createTask, getAllTasks, updateTask, deleteTasks } from "./lib/api";
export default function Home() {
  enum Priority {
    High = "High",
    Medium = "Medium",
    Low = "Low",
  }
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.High);
  const [onCreate, setOnCreating] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [updating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [updatedTitle, setUpdateTitle] = useState("");
  const [updatedDescription, setUpdateDescription] = useState("");
  const [updatedPriority, setUpdatePriority] = useState<Priority>(
    Priority.High,
  );
  const [updateCompleted, setUpdateCompleted] = useState(false);
  const onCreateClick = async () => {
    try {
      setOnCreating(true);
      const task = await createTask({ title, description, priority });
      setOnCreating(false);
    } catch (error) {
      console.log(error);
    } finally {
      setOnCreating(false);
    }
  };
  const onUpdateClick = async (id: string) => {
    try {
      setIsUpdating(true);
      setDialogOpen(true);
      await updateTask(id, {
        title: updatedTitle,
        description: updatedDescription,
        priority: updatedPriority,
        completed: updateCompleted,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const onDeleteClick = async (id: string) => {
    try {
      setIsDeleting(true);
      setDeletingId(id);
      await deleteTasks(id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    async function getTasks() {
      const tasks = await getAllTasks();
      setAllTasks(tasks.tasks!);
    }
    getTasks();
  }, [onCreate, isDeleting, updating]);
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl md:text-3xl p-5 text-center font-bold">
        CRUD TASK MANAGER
      </h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-5 border w-full max-w-md mx-auto rounded-lg flex flex-col justify-center"
      >
        <label htmlFor="title" className="flex flex-col gap-2">
          Title
          <input
            type="text"
            id="title"
            className="border-2 rounded-lg px-4 py-2 w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <br />

        <label htmlFor="description" className="flex flex-col gap-2">
          Description
          <input
            type="text"
            id="description"
            className="border-2 rounded-lg px-4 py-2 w-full"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <br />

        <label htmlFor="Priority" className="flex flex-col gap-2">
          Priority
          <select
            name="Priority"
            id="Priority"
            defaultValue={"High"}
            className="border rounded-xl p-3 w-full"
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="High" className="text-black">
              High
            </option>
            <option value="Medium" className="text-black">
              Medium
            </option>
            <option value="Low" className="text-black">
              Low
            </option>
          </select>
        </label>

        <br />

        <button
          className="cursor-pointer p-2 border rounded-2xl hover:text-black hover:bg-white transition w-full"
          onClick={() => onCreateClick()}
        >
          {!onCreate ? "Create Task" : "Creating Task !"}
        </button>
      </form>

      <section className="border w-full lg:w-3/4 xl:w-1/2 mx-auto mt-8 rounded-lg flex flex-col">
        <h1 className="p-4 text-3xl md:text-4xl font-bold text-center">
          ALL TASKS
        </h1>

        {allTasks.length != 0 &&
          allTasks.map(
            (task: {
              _id: string;
              title: string;
              description: string;
              priority: Priority;
              completed: boolean;
            }) => (
              <div
                className="border my-5 mx-2 rounded-lg p-4 flex flex-col"
                key={task._id}
              >
                <div className="flex flex-col gap-4 break-words">
                  <div>
                    <h1>Title : {task.title}</h1>
                  </div>

                  <div>
                    <h1>Description : {task.description}</h1>
                  </div>

                  <div>
                    <h1>Priority : {task.priority}</h1>
                  </div>

                  <div>
                    <h1>Completed : {task.completed ? "True" : "False"}</h1>
                  </div>
                </div>

                {dialogOpen && updatingId === task._id ? (
                  <div className="mt-4">
                    <form
                      onSubmit={(e) => e.preventDefault()}
                      className="p-5 border rounded-lg flex flex-col justify-center"
                    >
                      <label htmlFor="title" className="flex flex-col gap-2">
                        Title
                        <input
                          type="text"
                          id="title"
                          className="border-2 rounded-lg px-4 py-2 w-full"
                          onChange={(e) => setUpdateTitle(e.target.value)}
                        />
                      </label>

                      <br />

                      <label
                        htmlFor="description"
                        className="flex flex-col gap-2"
                      >
                        Description
                        <input
                          type="text"
                          id="description"
                          className="border-2 rounded-lg px-4 py-2 w-full"
                          onChange={(e) => setUpdateDescription(e.target.value)}
                        />
                      </label>

                      <br />

                      <label htmlFor="Priority" className="flex flex-col gap-2">
                        Priority
                        <select
                          name="Priority"
                          id="Priority"
                          defaultValue={"High"}
                          className="border rounded-xl p-3 w-full"
                          onChange={(e) =>
                            setUpdatePriority(e.target.value as Priority)
                          }
                        >
                          <option value="High" className="text-black">
                            High
                          </option>
                          <option value="Medium" className="text-black">
                            Medium
                          </option>
                          <option value="Low" className="text-black">
                            Low
                          </option>
                        </select>
                      </label>

                      <br />

                      <label
                        htmlFor="Completed"
                        className="flex flex-col gap-2"
                      >
                        Completed
                        <select
                          name="Completed"
                          id="Completed"
                          defaultValue={"false"}
                          className="border rounded-xl p-3 w-full"
                          onChange={(e) =>
                            setUpdateCompleted(
                              e.target.value == "false" ? false : true,
                            )
                          }
                        >
                          <option value={"true"} className="text-black">
                            True
                          </option>

                          <option value={"false"} className="text-black">
                            False
                          </option>
                        </select>
                      </label>

                      <br />

                      <button
                        className="cursor-pointer p-2 border rounded-2xl hover:text-black hover:bg-white transition w-full"
                        onClick={() => onUpdateClick(task._id)}
                      >
                        {!updating ? "Update Task" : "Updating Task !"}
                      </button>
                    </form>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    className="cursor-pointer p-2 border rounded-2xl hover:text-black hover:bg-white transition w-full"
                    onClick={() => {
                      if (dialogOpen && updatingId === task._id) {
                        setDialogOpen(false);
                        setUpdatingId("");
                      } else {
                        setUpdatingId(task._id);
                        setDialogOpen(true);
                      }
                    }}
                  >
                    {dialogOpen && updatingId === task._id
                      ? "Close Update Dialog"
                      : "Open Update Dialog"}
                  </button>

                  <button
                    className="cursor-pointer p-2 border rounded-2xl hover:text-white hover:bg-red-600 transition w-full"
                    onClick={() => onDeleteClick(task._id)}
                  >
                    {isDeleting && deletingId === task._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ),
          )}
      </section>
    </div>
  );
}
