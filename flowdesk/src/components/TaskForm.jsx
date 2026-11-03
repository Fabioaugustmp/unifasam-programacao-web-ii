import { useState } from "react";
import { TASK_PRIORITIES, TASK_STATUSES } from "../constants/task";

const EMPTY_TASK = {
    title: "",
    description: "",
    assignee: "",
    priority: "Média",
    status: "A fazer",
};

function TaskForm({ onCreate }) {
    const [task, setTask] = useState(EMPTY_TASK);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(event) {
        const { name, value } = event.target;
        setTask((currentTask) => ({ ...currentTask, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await onCreate(task);
            setTask(EMPTY_TASK);
        } catch (requestError) {
            // Mantém o que foi digitado para o usuário corrigir e tentar de novo.
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <label>
                Título
                <input name="title" value={task.title} onChange={handleChange} required />
            </label>
            <label>
                Descrição
                <input name="description" value={task.description} onChange={handleChange} />
            </label>
            <label>
                Responsável
                <input name="assignee" value={task.assignee} onChange={handleChange} />
            </label>
            <label>
                Prioridade
                <select name="priority" value={task.priority} onChange={handleChange}>
                    {TASK_PRIORITIES.map((priority) => (
                        <option key={priority}>{priority}</option>
                    ))}
                </select>
            </label>
            <label>
                Status
                <select name="status" value={task.status} onChange={handleChange}>
                    {TASK_STATUSES.map((status) => (
                        <option key={status}>{status}</option>
                    ))}
                </select>
            </label>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "+ Criar tarefa"}
            </button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}

export default TaskForm;
