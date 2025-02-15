document.addEventListener("DOMContentLoaded", function() {
    const habitContainer = document.getElementById("habit-container");
    const defaultHabits = [
        { id: "read", title: "Read", emoji: "📚", streak: 0, lastChecked: "" },
        { id: "workout", title: "Workout", emoji: "💪", streak: 0, lastChecked: "" },
        { id: "meditate", title: "Meditate", emoji: "☁️", streak: 0, lastChecked: "" }
    ];
    let storedHabits = JSON.parse(localStorage.getItem("habits")) || defaultHabits;

    function checkMissedDays() {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // Get YYYY-MM-DD
    
        storedHabits.forEach(habit => {
            if (habit.lastChecked && habit.lastChecked !== todayStr) {
                const lastCheckedDate = new Date(habit.lastChecked);
                const difference = (today - lastCheckedDate) / (1000 * 60 * 60 * 24);
    
                if (difference >= 2) {
                    habit.streak = 0; // Reset streak if 2 or more days are missed
                }
            }
            habit.lastChecked = todayStr; // Update lastChecked to today
        });
    
        localStorage.setItem("habits", JSON.stringify(storedHabits));
    }
    

    function renderHabits() {
        habitContainer.innerHTML = "";
        storedHabits.forEach((habit, index) => {
            const today = new Date().toDateString();
            const habitDiv = document.createElement("div");
            habitDiv.classList.add("habit");
            habitDiv.innerHTML = `
                <h2>${habit.title} ${habit.emoji}</h2>
                <p class="streak">Streak: <span>${habit.streak}</span></p>
                <input type="checkbox" ${habit.lastChecked === today ? "checked disabled" : ""}>
                <button class="delete-btn" data-index="${index}">&#128465;</button>
            `;
            const checkbox = habitDiv.querySelector("input");
            const streakElement = habitDiv.querySelector(".streak span");
            checkbox.addEventListener("change", function() {
                if (checkbox.checked) {
                    habit.streak++;
                    habit.completed = true;
                    checkbox.disabled = true;
                }
                streakElement.textContent = habit.streak;
                habitDiv.classList.toggle("completed", habit.completed);
                localStorage.setItem("habits", JSON.stringify(storedHabits));
            });
            
            habitContainer.appendChild(habitDiv);

            habitDiv.querySelector(".delete-btn").addEventListener("click", function() {
                if (confirm("Do you want to delete this habit?")) {
                    storedHabits.splice(index, 1);
                    localStorage.setItem("habits", JSON.stringify(storedHabits));
                    renderHabits();
                }
            });
        });
    }

    document.getElementById("reset-btn").addEventListener("click", function() {
        localStorage.removeItem("habits");
        location.reload();
    });

    document.getElementById("add-habit-btn").addEventListener("click", function() {
        const title = prompt("Enter the new habit title:");
        const emoji = prompt("Enter an emoji for this habit:");
        if (title && emoji) {
            storedHabits.push({ id: title.toLowerCase().replace(/\s+/g, "-"), title, emoji, streak: 0, lastChecked: "" });
            localStorage.setItem("habits", JSON.stringify(storedHabits));
            renderHabits();
        }
    });

    checkMissedDays();
    renderHabits();
});