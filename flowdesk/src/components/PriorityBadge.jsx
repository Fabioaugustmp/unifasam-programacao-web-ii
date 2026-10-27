function PriorityBadge({ priority }) {
    
    const priorityClass = {
        Alta: "priority-high",
        Média: "priority-medium",
        Baixa: "priority-low",
    }[priority] ?? "priority-low";
    
    return (
        <span className={`priority-badge ${priorityClass}`}>
            {priority}
        </span>
    );
}
export default PriorityBadge;