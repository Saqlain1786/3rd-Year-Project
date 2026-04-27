requireAuth();

const studentForm = document.getElementById('studentForm');
const studentsTableBody = document.getElementById('studentsTableBody');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');

const user = getUser();
if (user) {
  userName.textContent = `${user.name} (${user.role})`;
}

logoutBtn.addEventListener('click', (event) => {
  event.preventDefault();
  logout();
});

async function loadStudents() {
  try {
    const students = await apiRequest('/students');
    studentsTableBody.innerHTML = students
      .map(
        (student) => `
        <tr>
          <td>${student.name}</td>
          <td>${student.rollNumber}</td>
          <td>${student.class}</td>
        </tr>
      `
      )
      .join('');
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
}

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('studentName').value;
  const rollNumber = document.getElementById('rollNumber').value;
  const className = document.getElementById('studentClass').value;

  try {
    await apiRequest('/students', 'POST', { name, rollNumber, class: className });
    showAlert('alertBox', 'Student added successfully');
    studentForm.reset();
    await loadStudents();
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
});

loadStudents();
