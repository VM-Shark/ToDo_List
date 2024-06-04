document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        // Fetch tasks from the server
        const response = await fetch('/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();

        // Render tasks in the DOM
        const tasksContainer = document.getElementById('tasks');
        tasks.forEach(task => {
            renderTask(task, tasksContainer);
        });

        // Handle form submission
        const taskForm = document.getElementById('taskForm');
        const subtasksContainer = document.getElementById('subtasks');
        let subtaskIndex = 1;

        // Add new subtask fields dynamically
        document.getElementById('addSubtaskBtn').addEventListener('click', () => {
            const subtaskDiv = document.createElement('div');
            subtaskDiv.classList.add('subtask');
            subtaskDiv.innerHTML = `
                <input type="text" class="form-control mb-2" name="subTasks[${subtaskIndex}].title" placeholder="Subtask Title">
                <input type="text" class="form-control mb-2" name="subTasks[${subtaskIndex}].description" placeholder="Subtask Description">
            `;
            subtasksContainer.appendChild(subtaskDiv);
            subtaskIndex++;
        });

        taskForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            // Get form data
            const formData = new FormData(taskForm);
            const taskData = { subTasks: [] };

            formData.forEach((value, key) => {
                if (key.startsWith('subTasks')) {
                    const subtaskIndex = key.match(/\[(\d+)\]/)[1];
                    const subtaskField = key.match(/\.\w+$/)[0].slice(1);

                    if (!taskData.subTasks[subtaskIndex]) {
                        taskData.subTasks[subtaskIndex] = {};
                    }

                    taskData.subTasks[subtaskIndex][subtaskField] = value;
                } else {
                    taskData[key] = value;
                }
            });

            console.log('Submitting task data:', taskData); 

            try {
                // Send task data to the server
                const response = await fetch('/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(taskData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to add task: ${errorText}`);
                }

                // Add newly created task to the DOM
                const newTask = await response.json();
                renderTask(newTask, tasksContainer);

                // Clear form inputs
                taskForm.reset();
                // Reset subtask index and clear subtasks container
                subtaskIndex = 1;
                subtasksContainer.innerHTML = `
                    <h4>Subtasks</h4>
                `;
            } catch (error) {
                console.error('Error adding task:', error);
                alert('An error occurred while adding the task.');
            }
        });

        // Logout function
        const logout = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Logout failed');
                }

                // Remove authentication token from local storage
                localStorage.removeItem('token');
                console.log('Token removed from localStorage'); 

                // Redirect to login page
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Error logging out:', error);
                alert('An error occurred while logging out.');
            }
        };

        // Add event listener to logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', logout);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
});

// Function to render a task in the DOM
function renderTask(task, container) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>Description: ${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Due Date: ${task.dueDate}</p>
        <p>Completed: ${task.completed ? 'Yes' : 'No'}</p>
        <button class="btn btn-success complete-task-btn" data-id="${task._id}">Complete Task</button>
        <button class="btn btn-danger delete-task-btn" data-id="${task._id}">Delete Task</button>
    `;

    // Check if task has subtasks
    if (task.subTasks && task.subTasks.length > 0) {
        const subtasksList = document.createElement('ul');
        task.subTasks.forEach(subtask => {
            const subtaskItem = document.createElement('li');
            subtaskItem.innerHTML = `
                <strong>${subtask.title}</strong>: ${subtask.description} - Completed: ${subtask.completed ? 'Yes' : 'No'}
            `;
            subtasksList.appendChild(subtaskItem);
        });
        taskElement.appendChild(subtasksList);
    }

    // Add event listener for completing the task
taskElement.querySelector('.complete-task-btn').addEventListener('click', async () => {
    // Retrieve token here
    const token = localStorage.getItem('token'); 

    const taskId = taskElement.querySelector('.complete-task-btn').getAttribute('data-id');
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed: true })
        });

        if (!response.ok) {
            throw new Error('Failed to complete task');
        }

        taskElement.remove();
    } catch (error) {
        console.error('Error completing task:', error);
        alert('An error occurred while completing the task.');
    }
});

   // Add event listener for deleting the task
taskElement.querySelector('.delete-task-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('token'); 

    const taskId = taskElement.querySelector('.delete-task-btn').getAttribute('data-id');
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        taskElement.remove();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('An error occurred while deleting the task.');
    }
});
    container.appendChild(taskElement);
}