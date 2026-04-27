requireAuth();

const attendanceTableBody = document.getElementById('attendanceTableBody');
const attendanceDate = document.getElementById('attendanceDate');
const submitAttendanceBtn = document.getElementById('submitAttendance');
const logoutBtn = document.getElementById('logoutBtn');

const statusMap = {};
attendanceDate.value = new Date().toISOString().split('T')[0];

logoutBtn.addEventListener('click', (event) => {
  event.preventDefault();
  logout();
});

async function loadStudents() {
  try {
    const students = await apiRequest('/students');

    attendanceTableBody.innerHTML = students
      .map(
        (student) => `
          <tr>
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.class}</td>
            <td>
              <div class="status-buttons">
                <button class="success" onclick="setStatus('${student._id}','present')">Present</button>
                <button class="danger" onclick="setStatus('${student._id}','absent')">Absent</button>
                <span id="status-${student._id}">Not set</span>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    students.forEach((student) => {
      statusMap[student._id] = 'present';
      document.getElementById(`status-${student._id}`).textContent = 'Present';
    });
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
}

window.setStatus = (studentId, status) => {
  statusMap[studentId] = status;
  document.getElementById(`status-${studentId}`).textContent = status === 'present' ? 'Present' : 'Absent';
};

submitAttendanceBtn.addEventListener('click', async () => {
  try {
    const records = Object.entries(statusMap).map(([studentId, status]) => ({ studentId, status }));

    if (records.length === 0) {
      showAlert('alertBox', 'No students available to mark attendance', 'error');
      return;
    }

    await apiRequest('/attendance', 'POST', { date: attendanceDate.value, records });
    showAlert('alertBox', 'Attendance submitted successfully');
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
});

loadStudents();
