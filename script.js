document.addEventListener("DOMContentLoaded", function() {
    const scheduleContainer = document.getElementById('schedule-container');
    const downloadBtn = document.getElementById('download-btn');
    const uploadBtn = document.getElementById('upload-btn');

    // Generate dates from June 15 to August 4
    const startDate = new Date('2024-06-15');
    const endDate = new Date('2024-08-04');
    const allDates = generateDatesArray(startDate, endDate);

    // Create table
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    // Create header row
    const headerRow = document.createElement('tr');
    const emptyHeader = document.createElement('th');
    headerRow.appendChild(emptyHeader);
    const book1Header = document.createElement('th');
    book1Header.textContent = 'TAX';
    headerRow.appendChild(book1Header);
    const book2Header = document.createElement('th');
    book2Header.textContent = 'COMPANY LAW';
    headerRow.appendChild(book2Header);
    const book3Header = document.createElement('th');
    book3Header.textContent = 'MFA';
    headerRow.appendChild(book3Header);
    const book4Header = document.createElement('th');
    book4Header.textContent = 'FAR1';
    headerRow.appendChild(book4Header);
    tbody.appendChild(headerRow);

    // Create table body
    allDates.forEach(date => {
        const row = createRow(date);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    scheduleContainer.appendChild(table);

    // Load saved data from local storage
    loadSchedule();

    // Save data to local storage when input changes
    table.addEventListener('input', saveSchedule);

    // Add event listener to each clear button
    table.addEventListener('click', function(event) {
        if (event.target.classList.contains('clear-button')) {
            const row = event.target.closest('tr');
            clearRow(row);
            shiftRows(row);
        }
    });

    // Download button event listener
    downloadBtn.addEventListener('click', downloadSchedule);

    // Upload button event listener
    uploadBtn.addEventListener('change', uploadSchedule);

    function generateDatesArray(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    function createRow(date) {
        const row = document.createElement('tr');
        const dateHeader = document.createElement('th');
        dateHeader.textContent = formatDate(date);
        row.appendChild(dateHeader);

        const book1Cell = document.createElement('td');
        const book1Input = document.createElement('input');
        book1Input.setAttribute('type', 'text');
        book1Cell.appendChild(book1Input);
        row.appendChild(book1Cell);

        const book2Cell = document.createElement('td');
        const book2Input = document.createElement('input');
        book2Input.setAttribute('type', 'text');
        book2Cell.appendChild(book2Input);
        row.appendChild(book2Cell);

        const book3Cell = document.createElement('td');
        const book3Input = document.createElement('input');
        book3Input.setAttribute('type', 'text');
        book3Cell.appendChild(book3Input);
        row.appendChild(book3Cell);

        const book4Cell = document.createElement('td');
        const book4Input = document.createElement('input');
        book4Input.setAttribute('type', 'text');
        book4Cell.appendChild(book4Input);
        row.appendChild(book4Cell);

        // Add clear button
        const clearButtonCell = document.createElement('td');
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.classList.add('clear-button');
        clearButtonCell.appendChild(clearButton);
        row.appendChild(clearButtonCell);

        return row;
    }

    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function saveSchedule() {
        const inputs = table.querySelectorAll('input');
        const data = [];
        inputs.forEach(input => {
            data.push(input.value);
        });
        localStorage.setItem('scheduleData', JSON.stringify(data));
    }

    function loadSchedule() {
        const data = JSON.parse(localStorage.getItem('scheduleData'));
        if (data) {
            const inputs = table.querySelectorAll('input');
            inputs.forEach((input, index) => {
                input.value = data[index];
            });
        }
    }

    function clearRow(row) {
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }

    function shiftRows(clearedRow) {
        const rows = table.querySelectorAll('tr');
        const clearedIndex = Array.from(rows).indexOf(clearedRow);
        for (let i = rows.length - 1; i > clearedIndex; i--) {
            const currentRow = rows[i];
            const previousRow = rows[i - 1];
            const currentInputs = currentRow.querySelectorAll('input');
            const previousInputs = previousRow.querySelectorAll('input');
            currentInputs.forEach((input, index) => {
                input.value = previousInputs[index].value;
            });
        }
        clearRow(clearedRow);
    }

    function downloadSchedule() {
        const data = localStorage.getItem('scheduleData');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scheduleData.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    function uploadSchedule(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = e.target.result;
                localStorage.setItem('scheduleData', data);
                loadSchedule();
            };
            reader.readAsText(file);
        }
    }
});
