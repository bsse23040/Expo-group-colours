document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.getElementById('book-list');
    const addBookBtn = document.getElementById('add-book-btn');
    const applyDatesBtn = document.getElementById('apply-dates');
    const applySelectionBtn = document.getElementById('apply-selection-btn');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    const defaultBooks = [
        "Book 1", "Book 2", "Book 3", "Book 4", "Book 5"
    ];

    function initialize() {
        const choice = prompt("Do you want to create a new schedule or go to an already created one? Type (0) for 'new' or (1) for 'existing'.");

        if (choice.toLowerCase() === '1') {
            window.location.href = 'page1.html'; // Redirect to schedule page with existing data
        } else if (choice.toLowerCase() === '0') {
            setupNewSchedule();
        } else {
            alert("Invalid choice. Please refresh the page and try again.");
        }
    }

    function setupNewSchedule() {
        // Clear previous data
        localStorage.removeItem('scheduleData');
        localStorage.removeItem('startDate');
        localStorage.removeItem('endDate');
        localStorage.removeItem('checkedBooks');

        updateBookList();

        addBookBtn.addEventListener('click', function() {
            const newBook = prompt("Enter the name of the new book:");
            if (newBook) {
                if (!defaultBooks.includes(newBook)) {
                    defaultBooks.push(newBook);
                    updateBookList();
                } else {
                    alert("Book already exists.");
                }
            }
        });

        applyDatesBtn.addEventListener('click', function() {
            const startDateStr = startDateInput.value;
            const endDateStr = endDateInput.value;

            if (startDateStr && endDateStr) {
                const startDate = new Date(startDateStr);
                const endDate = new Date(endDateStr);

                if (startDate <= endDate) {
                    localStorage.setItem('startDate', startDate.toISOString());
                    localStorage.setItem('endDate', endDate.toISOString());
                } else {
                    alert("End date must be after the start date.");
                }
            } else {
                alert("Please select both start and end dates.");
            }
        });

        applySelectionBtn.addEventListener('click', function() {
            const checkedBooks = Array.from(document.querySelectorAll('#book-list input:checked'))
                .map(checkbox => checkbox.value);

            if (checkedBooks.length > 0) {
                localStorage.setItem('checkedBooks', JSON.stringify(checkedBooks));
                window.location.href = 'page1.html'; // Redirect to schedule page with new data
            } else {
                alert("Please select at least one book.");
            }
        });
    }

    function updateBookList() {
        bookList.innerHTML = '';
        defaultBooks.forEach((book) => {
            const label = document.createElement('label');
            label.className = 'custom-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = book;
            const checkedBooks = JSON.parse(localStorage.getItem('checkedBooks')) || [];
            if (checkedBooks.includes(book)) {
                checkbox.checked = true;
            }
            label.appendChild(checkbox);

            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';
            label.appendChild(checkmark);

            const textNode = document.createTextNode(book);
            label.appendChild(textNode);

            bookList.appendChild(label);
            bookList.appendChild(document.createElement('br'));
        });
    }

    // Initialize the page based on user's choice
    initialize();
});
