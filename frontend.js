const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resultDiv = document.getElementById('result');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    resultDiv.innerText = data.message;

    if (response.status === 200) {
      // Redirect to dashboard page on successful login
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerText = 'An error occurred during login.';
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(signupForm);
  const username = formData.get('username');
  const password = formData.get('password');
try {
    const response = await fetch(`/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    resultDiv.innerText = data.message;
  } catch (error) {
    console.error(error);
    resultDiv.innerText = 'An error occurred during signup.';
  }
});