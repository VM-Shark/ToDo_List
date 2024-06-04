document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    alert('Registration successful');
                    // Redirect to the login page
                    window.location.href = '/login.html'; 
                } else {
                    const data = await response.json();
                    alert(`Registration failed: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            // Prevent default form submission behavior
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Received token:', data.token); 
                    // Store the token in localStorage
                    localStorage.setItem('token', data.token); 
                    // Verify storage
                    console.log('Token stored in localStorage:', localStorage.getItem('token')); 
                    alert('Login successful');
                    // Redirect to the tasks page
                    window.location.href = '/index.html'; 
                } else {
                    const data = await response.json();
                    alert(`Login failed: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred.');
            }
        });
    }
});