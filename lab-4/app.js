const boardData = {
    todo: [],
    inprogress: [],
    done: []
};

// --- Helpers ---
function randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
}

function save() {
    localStorage.setItem("kanban", JSON.stringify(boardData));
}

function load() {
    const data = localStorage.getItem("kanban");
    if (data) Object.assign(boardData, JSON.parse(data));
}

function updateCounts() {
    document.querySelectorAll(".column").forEach(col => {
        const name = col.dataset.column;
        col.querySelector(".count").textContent = boardData[name].length;
    });
}

// --- Renderowanie kart ---
function render() {
    document.querySelectorAll(".column").forEach(col => {
        const name = col.dataset.column;
        const container = col.querySelector(".cards");
        container.innerHTML = "";

        boardData[name].forEach(card => {
            const div = document.createElement("div");
            div.className = "card";
            div.style.background = card.color;

            const text = document.createElement("div");
            text.textContent = card.title;
            text.contentEditable = true;
            text.addEventListener("input", () => {
                card.title = text.textContent;
                save();
            });

            const controls = document.createElement("div");
            controls.className = "controls";

            const del = document.createElement("button");
            del.textContent = "x";
            del.className = "delete";
            del.addEventListener("click", () => {
                boardData[name] = boardData[name].filter(c => c.id !== card.id);
                save();
                render();
            });

            const moveLeft = document.createElement("button");
            moveLeft.textContent = "←";
            moveLeft.className = "move";
            moveLeft.addEventListener("click", () => moveCard(card.id, name, -1));

            const moveRight = document.createElement("button");
            moveRight.textContent = "→";
            moveRight.className = "move";
            moveRight.addEventListener("click", () => moveCard(card.id, name, +1));

            const recolor = document.createElement("button");
            recolor.textContent = "Kolor";
            recolor.className = "recolor";
            recolor.addEventListener("click", () => {
                card.color = randomColor();
                save();
                render();
            });

            controls.append(moveLeft, moveRight, recolor, del);
            div.append(text, controls);
            container.append(div);
        });
    });

    updateCounts();
}

// --- Przenoszenie kart ---
const order = ["todo", "inprogress", "done"];

function moveCard(id, from, direction) {
    const idx = boardData[from].findIndex(c => c.id === id);
    if (idx === -1) return;

    const card = boardData[from][idx];
    const colIndex = order.indexOf(from);
    const newColIndex = colIndex + direction;

    if (newColIndex < 0 || newColIndex >= order.length) return;

    const to = order[newColIndex];

    boardData[from].splice(idx, 1);
    boardData[to].push(card);

    save();
    render();
}

// --- Tworzenie nowej karty ---
document.querySelectorAll(".add-card").forEach(btn => {
    btn.addEventListener("click", () => {
        const column = btn.closest(".column").dataset.column;

        const newCard = {
            id: Date.now() + Math.random(),
            title: "Nowa karta",
            color: randomColor()
        };

        boardData[column].push(newCard);
        save();
        render();
    });
});

// --- Kolorowanie kolumn ---
document.querySelectorAll(".color-column").forEach(btn => {
    btn.addEventListener("click", () => {
        const column = btn.closest(".column").dataset.column;
        boardData[column].forEach(card => {
            card.color = randomColor();
        });
        save();
        render();
    });
});

// --- Sortowanie ---
document.querySelectorAll(".sort-column").forEach(btn => {
    btn.addEventListener("click", () => {
        const column = btn.closest(".column").dataset.column;
        boardData[column].sort((a, b) => a.title.localeCompare(b.title));
        save();
        render();
    });
});

// --- Start ---
load();
render();
