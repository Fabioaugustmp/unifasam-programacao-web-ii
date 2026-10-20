function TaskColumn({title, children}) {
    return (
        <section className="task-column">
            <h2>{title}</h2>
            <div className="task-list">
                {children}
            </div>
        </section>
    );
}

export default TaskColumn;