requireAuth();

const reportDate = document.getElementById('reportDate');
const loadReportBtn = document.getElementById('loadReport');
const reportTableBody = document.getElementById('reportTableBody');
const summaryCards = document.getElementById('summaryCards');
const logoutBtn = document.getElementById('logoutBtn');

reportDate.value = new Date().toISOString().split('T')[0];

logoutBtn.addEventListener('click', (event) => {
  event.preventDefault();
  logout();
});

async function loadReport() {
  try {
    const date = reportDate.value;
    const data = await apiRequest(`/attendance?date=${date}`);

    summaryCards.innerHTML = `
      <div class="card"><strong>Total:</strong> ${data.total}</div>
      <div class="card"><strong>Present:</strong> ${data.presentCount}</div>
      <div class="card"><strong>Absent:</strong> ${data.absentCount}</div>
      <div class="card"><strong>Attendance %:</strong> ${data.attendancePercentage}%</div>
    `;

    reportTableBody.innerHTML = data.records
      .map(
        (record) => `
          <tr>
            <td>${record.date}</td>
            <td>${record.studentId?.name || '-'}</td>
            <td>${record.studentId?.rollNumber || '-'}</td>
            <td>${record.studentId?.class || '-'}</td>
            <td>
              <span class="badge ${record.status === 'present' ? 'badge-present' : 'badge-absent'}">
                ${record.status}
              </span>
            </td>
          </tr>
        `
      )
      .join('');

    if (data.records.length === 0) {
      showAlert('alertBox', 'No attendance found for selected date', 'error');
    }
  } catch (error) {
    showAlert('alertBox', error.message, 'error');
  }
}

loadReportBtn.addEventListener('click', loadReport);
loadReport();
