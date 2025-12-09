let songs = [];
let viewMode = "cards";
let currentSort = "date";
let sortDir = "desc";

document.addEventListener("DOMContentLoaded", () => {
    songs = JSON.parse(localStorage.getItem("songs")) || [];
    render();
});

document.getElementById("sortDirBtn").addEventListener("click", () => {
    sortDir = (sortDir === "desc") ? "asc" : "desc";
    render();

    document.getElementById("sortDirBtn").innerHTML =
        sortDir === "desc"
        ? `<i class="fas fa-arrow-down-wide-short"></i>`
        : `<i class="fas fa-arrow-up-wide-short"></i>`;
});

// ==== SEARCH ====
document.getElementById("searchBox").addEventListener("input", () => render());

// ==== SORT ====
document.querySelectorAll("input[name='sort']").forEach(radio => {
    radio.addEventListener("change", () => {
        currentSort = radio.value;
        render();
    });
});

// ==== VIEW SWITCH ====
document.getElementById("toggleViewBtn").addEventListener("click", () => {
    viewMode = (viewMode === "cards") ? "table" : "cards";
    render();
});

// ==== STARS RENDER ====
function stars(r) {
    const v = r / 2;
    let full = Math.floor(v);
    let half = (v % 1 !== 0);
    let empty = 5 - full - (half ? 1 : 0);

    return `<span class='star-gold'>`
        + "<i class='fa-solid fa-star'></i>".repeat(full)
        + (half ? "<i class='fa-regular fa-star-half-stroke'></i>" : "")
        + "<i class='fa-regular fa-star'></i>".repeat(empty)
        + `</span>`;
}

// ==== EXTRACT YT ID ====
function extractID(url) {
    return url.split("v=")[1]?.substring(0, 11) || "";
}

// ==== PLAY ====
function playSong(id) {
    let s = songs.find(x => x.id == id);
    document.getElementById("modalTitle").innerText = s.title;
    document.getElementById("playerFrame").src =
        `https://www.youtube.com/embed/${extractID(s.url)}`;
    new bootstrap.Modal(document.getElementById("playerModal")).show();
}

// ==== DELETE ====
function deleteSong(id) {
    if (!confirm("Delete song?")) return;
    songs = songs.filter(s => s.id !== id);
    save();
}

// ==== EDIT ====
function editSong(id) {
    let s = songs.find(x => x.id == id);
    document.getElementById("title").value = s.title;
    document.getElementById("url").value = s.url;
    document.getElementById("rating").value = s.rating;
    document.getElementById("songId").value = s.id;
    document.getElementById("submitBtn").innerHTML = "<i class='fas fa-save'></i> Update";
}

// ==== ADD / UPDATE ====
document.getElementById("songForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let title = document.getElementById("title").value;
    let url = document.getElementById("url").value;
    let rating = document.getElementById("rating").value;
    let sid = document.getElementById("songId").value;

    if (sid) {
        let s = songs.find(x => x.id == sid);
        s.title = title;
        s.url = url;
        s.rating = rating;
    } else {
        songs.push({
            id: crypto.randomUUID(),
            title,
            url,
            rating,
            date: Date.now()
        });
    }

    save();
    e.target.reset();
    document.getElementById("submitBtn").innerHTML = "<i class='fas fa-plus'></i> Add";
    document.getElementById("songId").value = "";
});

function save() {
    localStorage.setItem("songs", JSON.stringify(songs));
    render();
}

// ==== DISPLAY ====
function render() {
    let sorted = [...songs];

    let search = document.getElementById("searchBox").value.toLowerCase();
    sorted = sorted.filter(s => s.title.toLowerCase().includes(search));

    if(currentSort === "name")
        sorted.sort((a,b)=> 
            sortDir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );

    else if(currentSort === "rating")
        sorted.sort((a,b)=>
            sortDir === "asc" ? Number(a.rating)-Number(b.rating) : Number(b.rating)-Number(a.rating)
        );

    else  
        sorted.sort((a,b)=>
            sortDir === "asc" ? a.date-b.date : b.date-a.date
        );

    document.getElementById("stats").innerText =
        `Total Songs: ${songs.length}`;

    let cards = document.getElementById("cardsContainer");
    let table = document.getElementById("songTable");
    let tbody = document.getElementById("songList");

    cards.innerHTML = "";
    tbody.innerHTML = "";

    sorted.forEach(song => {
        let id = extractID(song.url);

        // ==== CARDS ====
        cards.innerHTML += `
        <div class="col-md-4">
            <div class="card song-card mb-3">
                <img src="https://img.youtube.com/vi/${id}/0.jpg" class="card-img-top">
                <div class="card-body">
                    <h5 class="song-title-card">${song.title}</h5>
                    <p>${stars(song.rating)}</p>
                    <p>${song.rating}/10</p>

                    <button class="btn btn-primary w-100 mb-1" onclick="playSong('${song.id}')">Play</button>
                    <button class="btn btn-warning w-100 mb-1" onclick="editSong('${song.id}')">Edit</button>
                    <button class="btn btn-danger w-100" onclick="deleteSong('${song.id}')">Delete</button>
                </div>
            </div>
        </div>`;

        // ==== TABLE ====
        tbody.innerHTML += `
        <tr>
            <td><img src="https://img.youtube.com/vi/${id}/0.jpg" width="70"></td>
            <td>${song.title}</td>
            <td>${stars(song.rating)}</td>
            <td>${song.rating}/10</td>
            <td>${new Date(song.date).toLocaleString()}</td>
            <td class='text-end'>
                <button class='btn btn-sm btn-primary' onclick="playSong('${song.id}')"><i class='fas fa-play'></i></button>
                <button class='btn btn-sm btn-warning' onclick="editSong('${song.id}')"><i class='fas fa-edit'></i></button>
                <button class='btn btn-sm btn-danger' onclick="deleteSong('${song.id}')"><i class='fas fa-trash'></i></button>
            </td>
        </tr>`;
    });

    if (viewMode === "cards") {
        cards.classList.remove("d-none");
        table.classList.add("d-none");
    } else {
        cards.classList.add("d-none");
        table.classList.remove("d-none");
    }
}
