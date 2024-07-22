document.addEventListener("DOMContentLoaded", function() {
    const scheduleContainer = document.getElementById('schedule-container');
    const downloadBtn = document.getElementById('download-btn');
    const uploadBtn = document.getElementById('upload-btn');

    let subjectNames;
    let allDates;

    const savedData = localStorage.getItem('scheduleData');

    if (savedData) {
        const userChoice = confirm("Do you want to view the existing schedule? Click 'Cancel' to create a new schedule.");
        if (userChoice) {
            const { subjects, dates, data } = JSON.parse(savedData);
            subjectNames = subjects;
            allDates = dates.map(date => new Date(date));
            generateSchedule(subjectNames, allDates, data);
        } else {
            createNewSchedule();
        }
    } else {
        createNewSchedule();
    }

    function createNewSchedule() {
        const numberOfSubjects = parseInt(prompt("Enter the number of subjects:"), 10);
        subjectNames = [];
        for (let i = 0; i < numberOfSubjects; i++) {
            const subjectName = prompt(`Enter the name of subject ${i + 1}:`);
            subjectNames.push(subjectName);
        }
        const startDateStr = prompt("Enter the start date (DD/MM/YY):");
        const endDateStr = prompt("Enter the end date (DD/MM/YY):");
        const startDate = parseDate(startDateStr);
        const endDate = parseDate(endDateStr);
        allDates = generateDatesArray(startDate, endDate);
        generateSchedule(subjectNames, allDates);
    }

    function generateSchedule(subjectNames, allDates, savedData = []) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule if any

        // Create table
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        // Create header row
        const headerRow = document.createElement('tr');
        const emptyHeader = document.createElement('th');
        headerRow.appendChild(emptyHeader);
        subjectNames.forEach(subject => {
            const subjectHeader = document.createElement('th');
            subjectHeader.textContent = subject.toUpperCase();
            headerRow.appendChild(subjectHeader);
        });
        tbody.appendChild(headerRow);

        // Create table body
        allDates.forEach((date, dateIndex) => {
            const row = createRow(date, subjectNames.length, savedData[dateIndex]);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        scheduleContainer.appendChild(table);

        // Save data to local storage when input changes
        table.addEventListener('input', saveSchedule);

        // Add event listener to each clear button
        table.addEventListener('click', function(event) {
            if (event.target.classList.contains('clear-button')) {
                const row = event.target.closest('tr');
                shiftRows(row);
                clearRow(row);
            }
        });

        // Download button event listener
        downloadBtn.addEventListener('click', downloadSchedule);

        // Upload button event listener
        uploadBtn.addEventListener('change', uploadSchedule);
    }

    function generateDatesArray(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    function createRow(date, subjectCount, savedData = []) {
        const row = document.createElement('tr');
        const dateHeader = document.createElement('th');
        dateHeader.textContent = formatDate(date);
        row.appendChild(dateHeader);

        for (let i = 0; i < subjectCount; i++) {
            const cell = document.createElement('td');
            const textarea = document.createElement('textarea');
            if (savedData && savedData[i]) {
                textarea.value = savedData[i];
            }
            cell.appendChild(textarea);
            row.appendChild(cell);
        }

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
        const textareas = scheduleContainer.querySelectorAll('textarea');
        const data = [];
        textareas.forEach(textarea => {
            data.push(textarea.value);
        });
        const savedData = { subjects: subjectNames, dates: allDates.map(date => date.toISOString()), data: chunkArray(data, subjectNames.length) };
        localStorage.setItem('scheduleData', JSON.stringify(savedData));
    }

    function clearRow(row) {
        const textareas = row.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.value = '';
        });
    }

    function shiftRows(clearedRow) {
        const rows = scheduleContainer.querySelectorAll('tr');
        const clearedIndex = Array.from(rows).indexOf(clearedRow);
        for (let i = rows.length - 2; i >= clearedIndex; i--) {
            const currentRow = rows[i];
            const nextRow = rows[i + 1];
            const currentTextareas = currentRow.querySelectorAll('textarea');
            const nextTextareas = nextRow.querySelectorAll('textarea');
            currentTextareas.forEach((textarea, index) => {
                nextTextareas[index].value = textarea.value;
            });
        }
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
                location.reload();
            };
            reader.readAsText(file);
        }
    }

    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year + 2000, month - 1, day); // Adjusting year to 2000+
    }

    function chunkArray(arr, chunkSize) {
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize));
        }
        return result;
    }
});
