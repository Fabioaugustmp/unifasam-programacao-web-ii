import PriorityBadge from "./PriorityBadge";

function TaskCard({ id, title, assignee, priority, completed = true, onComplete }) {
    return (
        <article className={`task-card ${completed ? "task-card--completed" : ""}`}>
            <h3>{id} - {title}</h3>
            <p>Responsável: {assignee}</p>
            <button 
                type="button"
                onClick={() => onComplete(id)}
                disabled={completed} >
                {completed ? "Tarefa Concluída" : "Concluir Tarefa" }
            </button>
            <PriorityBadge priority={priority} />
        </article>
    )
}

export default TaskCard;
