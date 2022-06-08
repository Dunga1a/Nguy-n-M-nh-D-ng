var songsApi = 'http://localhost:3000/songs';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

function start() {
    this.defineProperties();
    getSongs();
    this.handleEvents();
    this.loadCurrentSong();
}

start();

function getSongs() {
    fetch(songsApi)
    .then(function(response) {
        var object = response.json();
        return object;
    })
    
    .then(function renderSong(songs) {
        

        const htmls = songs.map((song, index) => {
            return `
                <div class="song ${
                index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.thumbnail}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join("");
        
        
    })
}

function handleEvents() {
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    
    document.onscroll = function() {
        const scollTop = window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scollTop
        
        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth
    }
}

function defineProperties() {
    Object.defineProperty(this, 'currentSong', {
            
        get: function() {
            return this.songs[this.currentIndex]
        }
    })
}

function loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`;
    audio.src = this.currentSong.path;
}

