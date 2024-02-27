// Check if the colors were previously saved in localStorage
for (var i = 1; i <= 8; i++) {
    var savedColor = localStorage.getItem("selectedColor" + i);
    if (savedColor) {
        document.getElementById("colorPicker" + i).value = savedColor;
    }
}

function saveColors() {
    var colors = [];
    for (var i = 1; i <= 8; i++) {
        var color = document.getElementById("colorPicker" + i).value;
        colors.push(color);
        localStorage.setItem("selectedColor" + i, color); // Save color to localStorage
    }

    var userEmail = prompt("Please enter your email:");
    if (userEmail) {
        var message = "Your chosen colors have been saved and sent to Prof. Husnain Riaz as well as Mohsin Aujla (along with your email: " + userEmail + ")! Thanks for informing... ❤️";
        alert(message);
    } else {
        alert("Your chosen colors have been saved! Thanks for informing... ❤️");
    }
}
