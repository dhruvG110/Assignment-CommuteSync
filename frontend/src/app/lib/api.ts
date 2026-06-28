import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
type createTaskPayLoad = {
  title: string;
  description: string;
  priority: "High" | "Low" | "Medium";
};
type updateTaskPayLoad = {
  title: string;
  description: string;
  priority: "High" | "Low" | "Medium";
  completed : boolean;
};
export async function createTask(taskPayload: createTaskPayLoad) {
  const { title, description, priority } = taskPayload;
  const apiFetch = await axios.post(`${apiUrl}create-task`, {
    title,
    description,
    priority,
  });
  return apiFetch.data;
}
export async function getAllTasks(){
    const apiFetch = await axios.get(`${apiUrl}get-all-tasks`);
    return apiFetch.data;
}
export async function updateTask(id:string , updatePayload : updateTaskPayLoad){
    const {title , description ,priority , completed} = updatePayload;
    const apiFetch = await axios.put(`${apiUrl}update-tasks/${id}`,{
        title,
        description,
        priority,
        completed
    })
    return apiFetch.data;
}
export async function deleteTasks(id :string){
    const apiFetch = await axios.delete(`${apiUrl}delete/${id}`);
    return apiFetch.data;
}