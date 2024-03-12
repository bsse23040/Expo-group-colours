document.addEventListener("DOMContentLoaded", function() {
  const tableBody = document.querySelector("#checkboxTable tbody");
  const days = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"];

  // Function to load checkbox states from local storage
  function loadCheckboxStates() {
    for (let i = 0; i < 31; i++) {
      for (let j = 0; j < 5; j++) { // Adjusted the loop range to exclude Day and Date columns
        const checkbox = document.querySelector(`#checkbox-${i}-${j + 2}`); // Adjusted the column index
        const checkboxState = localStorage.getItem(`checkbox-${i}-${j + 2}`); // Adjusted the column index
        if (checkboxState === "true") {
          checkbox.checked = true;
        }
      }
    }
  }

  // Function to save checkbox states to local storage
  function saveCheckboxState(row, col, state) {
    localStorage.setItem(`checkbox-${row}-${col}`, state);
  }

  // Loop through each row
  for (let i = 0; i < 31; i++) {
    const row = document.createElement("tr");

    // First column (header for row)
    const headerCell = document.createElement("th");
    headerCell.textContent = (i + 1).toString();
    row.appendChild(headerCell);

    // Second column (date)
    const dateCell = document.createElement("td");
    const dateValue = new Date(2024, 2, 12 + i); // Assuming the starting date is March 12, 2024
    dateCell.textContent = dateValue.toLocaleDateString("en-US");
    row.appendChild(dateCell);

    // Third column (day)
    const dayCell = document.createElement("td");
    const dayIndex = i % 7; // Index of the day in the days array
    dayCell.textContent = days[dayIndex];
    row.appendChild(dayCell);

    // Add checkboxes for each prayer and Quran Recitation
    for (let j = 0; j < 6; j++) { // Adjusted the loop range to exclude Day and Date columns and include Quran Recitation column
      const cell = document.createElement("td");
      if (j < 5) { // For prayers
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${i}-${j + 2}`; // Adjusted the column index
        checkbox.addEventListener("change", function() {
          saveCheckboxState(i, j + 2, this.checked); // Adjusted the column index
        });
        cell.appendChild(checkbox);
      } else { // For Quran Recitation
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${i}-${j + 2}`; // Adjusted the column index
        checkbox.addEventListener("change", function() {
          saveCheckboxState(i, j + 2, this.checked); // Adjusted the column index
        });
        cell.appendChild(checkbox);
      }
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }

  // Load checkbox states from local storage
  loadCheckboxStates();
});
