var songsApi = "http://localhost:3000/songs";
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

// function start() {
//     this.defineProperties();
//     getSongs(renderSong);
//     this.handleEvents();
//     this.loadCurrentSong();
// }

// start();
getSongs(playList);
function getSongs(callback) {
  fetch(songsApi)
    .then(function (response) {
      var object = response.json();
      return object;
    })

    .then(callback);
}

function createSongs(data, callback) {
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  };

  fetch(songsApi, options)
    .then(function (response) {
      return response.json();
    })

    .then(callback);
}

function deleteSong(id) {
  var options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  fetch(songsApi + "/" + id, options)
    .then(function (response) {
      return response.json();
    })

    .then(function () {
      var songItems = document.querySelector("#id-" + id);
      songItems.remove();
    });
}

function playList(listSong) {
  var app = {
    //,
    currentIndex: 0,
    songs: listSong,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    render: function () {
      const htmls = this.songs.map((song, index) => {
        return `
                            <div class="song ${
                              index === this.currentIndex ? "active" : ""
                            }" id="id-${song.id}" data-index="${index}">
                                <div class="thumb"
                                    style="background-image: url('${
                                      song.thumbnail
                                    }')">
                                </div>
                                <div class="body">
                                    <h3 class="title">${song.name}</h3>
                                    <p class="author">${song.singer}</p>
                                </div>
                                <div class="option">
                                    <i class="fas fa-ellipsis-h class="icon-option""></i>
                                    <Xóa class="btn-delete" onclick="deleteSong(${song.id})">Xóa</button>
                                </div>

                            </div>
                        `;
      });
      playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
      Object.defineProperty(this, "currentSong", {
        get: function () {
          return this.songs[this.currentIndex];
        },
      });
    },

    handleCreateForm: function () {
      // Xử lý thêm bài nhạc
      var create = document.querySelector("#create");

      create.onclick = function () {
        var name = document.querySelector('input[name="name"]').value;
        var singer = document.querySelector('input[name="singer"]').value;
        var path = document.querySelector('input[name="path"]').value;
        var thumbnail = document.querySelector('input[name="thumbnail"]').value;

        var formData = {
          name: name,
          singer: singer,
          path: path,
          thumbnail: thumbnail,
        };

        createSongs(formData, function () {
          getSongs(render);
        });
      };
    },

    handleEvents: function () {
      const _this = this;
      const cdWidth = cd.offsetWidth;

      // Xử lý CD quay / dừng
      // Handle CD spins / stops
      const cdThumbAnimate = cdThumb.animate(
        [{ transform: "rotate(360deg)" }],
        {
          duration: 10000, // 10 seconds
          iterations: Infinity,
        }
      );
      cdThumbAnimate.pause();

      // Xử lý phóng to / thu nhỏ CD
      // Handles CD enlargement / reduction
      document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      };

      // Xử lý khi click play
      // Handle when click play
      playBtn.onclick = function () {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      };

      // Khi song được play
      // When the song is played
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };

      // Khi song bị pause
      // When the song is pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      // Khi tiến độ bài hát thay đổi
      // When the song progress changes
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // Xử lý khi tua song
      // Handling when seek
      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };

      // Khi next song
      // When next song
      nextBtn.onclick = function () {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      // Khi prev song
      // When prev song
      prevBtn.onclick = function () {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.prevSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      // Xử lý bật / tắt random song
      // Handling on / off random song
      randomBtn.onclick = function (e) {
        _this.isRandom = !_this.isRandom;
        _this.setConfig("isRandom", _this.isRandom);
        randomBtn.classList.toggle("active", _this.isRandom);
      };

      // Xử lý lặp lại một song
      // Single-parallel repeat processing
      repeatBtn.onclick = function (e) {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);
      };

      // Xử lý next song khi audio ended
      // Handle next song when audio ended
      audio.onended = function () {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextBtn.click();
        }
      };

      // Lắng nghe hành vi click vào playlist
      // Listen to playlist clicks
      playlist.onclick = function (e) {
        const songNode = e.target.closest(".song:not(.active)");
        // var btnDelete = document.querySelector("btn-delete");
        const optionNode = e.target.closest(".option");
        if (!e.target.closest(".option")) {
          // Xử lý khi click vào song
          // Handle when clicking on the song
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }
        }
        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
          //console.log(e.target.closest(".option").childNodes[3].classList.add('open-tw'))
          optionNode.childNodes[3].classList.remove("open-tw");

          optionNode.childNodes[3].classList.add("open-tw");
        }

        // const btnOptions = document.querySelectorAll('.option');
        // console.log(btnOptions)
        // btnOptions.forEach(function(option, index) {
        //   const btnDl = btnDelete[index]
        //   console.log(btnDl)
        //   option.onclick = function(){
        //     console.log(this)
        //     btnDl.style.display = 'block';
        //   }
        // })
      };
    },
    scrollToActiveSong: function () {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 300);
    },
    loadCurrentSong: function () {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`;
      audio.src = this.currentSong.path;
    },
    loadConfig: function () {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },
    prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
    },
    playRandomSong: function () {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex);

      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },
    start: function () {
      // Gán cấu hình từ config vào ứng dụng
      // Assign configuration from config to application
      this.loadConfig();

      // Định nghĩa các thuộc tính cho object
      // Defines properties for the object
      this.defineProperties();

      // Lắng nghe / xử lý các sự kiện (DOM events)
      // Listening / handling events (DOM events)
      this.handleEvents();

      // Thêm bài hát
      this.handleCreateForm();

      // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
      // Load the first song information into the UI when running the app
      this.loadCurrentSong();

      // Render playlist
      this.render();

      // Hiển thị trạng thái ban đầu của button repeat & random
      // Display the initial state of the repeat & random button
      randomBtn.classList.toggle("active", this.isRandom);
      repeatBtn.classList.toggle("active", this.isRepeat);
      this.render();
    },

    //}
  };
  app.start();
}

// function renderSong(songs) {
//     const htmls = songs.map((song, index) => {
//         return `
//             <div class="song ${
//             index === this.currentIndex ? "active" : ""
//             }" data-index="${index}">
//                 <div class="thumb"
//                     style="background-image: url('${song.thumbnail}')">
//                 </div>
//                 <div class="body">
//                     <h3 class="title">${song.name}</h3>
//                     <p class="author">${song.singer}</p>
//                 </div>
//                 <div class="option">
//                     <i class="fas fa-ellipsis-h"></i>
//                 </div>
//             </div>
//         `;
//     });
//     playlist.innerHTML = htmls.join("");

// }

// function handleEvents() {
//     const cd = $(".cd");
//     const cdWidth = cd.offsetWidth;

//     document.onscroll = function() {
//         const scollTop = window.scrollY || document.documentElement.scrollTop
//         const newCdWidth = cdWidth - scollTop

//         cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
//         cd.style.opacity = newCdWidth / cdWidth
//     }
// }

// function defineProperties() {
//     Object.defineProperty(this, 'currentSong', {

//         get: function() {
//             return this.songs[this.currentIndex]
//         }
//     })
// }

// function loadCurrentSong() {
//     heading.textContent = this.currentSong.name;
//     cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`;
//     audio.src = this.currentSong.path;
// }

// const apiSongs = 'http://localhost:3000/songs'
