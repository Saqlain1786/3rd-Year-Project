const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (getToken()) {
  window.location.href = '/dashboard.html';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    setAuth(data);
    showAlert('alertBox', 'Login successful');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 700);
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  try {
    const data = await apiRequest('/auth/register', 'POST', { name, email, password, role });
    setAuth(data);
    showAlert('alertBox', 'Registration successful');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 700);
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
});
