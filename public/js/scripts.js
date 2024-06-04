document.getElementById("taskForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    const task = {
        title,
        description,
        dueDate,
        priority
    };

    try {
        const response = await fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            alert("Task added successfully!");
            // Refresh task list after adding a new task
            fetchTasks(); 
        } else {
            alert("Failed to add task.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred.");
    }
});

async function fetchTasks() {
    try {
        const response = await fetch("/tasks");
        const tasks = await response.json();

        const tasksContainer = document.getElementById("tasks");
        tasksContainer.innerHTML = "";

        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.className = "task";

            taskElement.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}</p>
                <p><strong>Completed:</strong> ${task.completed ? "Yes" : "No"}</p>
            `;

            tasksContainer.appendChild(taskElement);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Fetch tasks on page load
fetchTasks();