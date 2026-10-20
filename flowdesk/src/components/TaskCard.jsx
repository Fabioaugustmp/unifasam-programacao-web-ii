function TaskCard({ title, assignee, priority }) {
    return (
        <article className="task-card">
            <h3>{title}</h3>
            <p>Responsável: {assignee}</p>
            <p>Prioridade: {priority}</p>
        </article>
    )
}

export default TaskCard;