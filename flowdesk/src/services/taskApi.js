
// Consultar todas as minhas tasks 
export async function listTasks() {
    return await fetch(`http://localhost:3000/api/tasks`);
}