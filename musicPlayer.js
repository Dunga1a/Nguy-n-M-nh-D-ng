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
                                    <X??a class="btn-delete" onclick="deleteSong(${song.id})">X??a</button>
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
      // X??? l?? th??m b??i nh???c
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

      // X??? l?? CD quay / d???ng
      // Handle CD spins / stops
      const cdThumbAnimate = cdThumb.animate(
        [{ transform: "rotate(360deg)" }],
        {
          duration: 10000, // 10 seconds
          iterations: Infinity,
        }
      );
      cdThumbAnimate.pause();

      // X??? l?? ph??ng to / thu nh??? CD
      // Handles CD enlargement / reduction
      document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      };

      // X??? l?? khi click play
      // Handle when click play
      playBtn.onclick = function () {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      };

      // Khi song ???????c play
      // When the song is played
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };

      // Khi song b??? pause
      // When the song is pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      // Khi ti???n ????? b??i h??t thay ?????i
      // When the song progress changes
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // X??? l?? khi tua song
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

      // X??? l?? b???t / t???t random song
      // Handling on / off random song
      randomBtn.onclick = function (e) {
        _this.isRandom = !_this.isRandom;
        _this.setConfig("isRandom", _this.isRandom);
        randomBtn.classList.toggle("active", _this.isRandom);
      };

      // X??? l?? l???p l???i m???t song
      // Single-parallel repeat processing
      repeatBtn.onclick = function (e) {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);
      };

      // X??? l?? next song khi audio ended
      // Handle next song when audio ended
      audio.onended = function () {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextBtn.click();
        }
      };

      // L???ng nghe h??nh vi click v??o playlist
      // Listen to playlist clicks
      playlist.onclick = function (e) {
        const songNode = e.target.closest(".song:not(.active)");
        var btnDelete = document.querySelector("btn-delete");
        const optionNode = e.target.closest(".option");
        if (!e.target.closest(".option")) {
          // X??? l?? khi click v??o song
          // Handle when clicking on the song
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }
        }
        // X??? l?? khi click v??o song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
          //console.log(e.target.closest(".option").childNodes[3].classList.add('open-tw'))
          // optionNode.childNodes[3].classList.remove("open-tw");

          optionNode.childNodes[3].classList.toggle("open-tw");
          setTimeout(function() {
            optionNode.childNodes[3].classList.remove("open-tw");
          },5000)
        }else {
          console.log(optionNode.childNodes[3].classList.remove("open-tw"))
          optionNode.childNodes[3].classList.remove("open-tw");
          optionNode.removeChild(btnDelete)
        }
        // else if(e.target.closest(".container")){
        //   console.log(e.target.closest(".container"))
        //   e.target.closest(".container").classList.remove("open-tw")
        // }
        // const container = document.querySelector('.container')
        // const option = document.querySelector('.option')
        // // console.log(container)
        // option.onclick = function(){
        //   var btn_delete = document.querySelector('.open-tw')
        //   if(btn_delete){
        //     btn_delete.style.display = 'none'
        //   }
        // }

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
      // G??n c???u h??nh t??? config v??o ???ng d???ng
      // Assign configuration from config to application
      this.loadConfig();

      // ?????nh ngh??a c??c thu???c t??nh cho object
      // Defines properties for the object
      this.defineProperties();

      // L???ng nghe / x??? l?? c??c s??? ki???n (DOM events)
      // Listening / handling events (DOM events)
      this.handleEvents();

      // Th??m b??i h??t
      this.handleCreateForm();

      // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
      // Load the first song information into the UI when running the app
      this.loadCurrentSong();

      // Render playlist
      this.render();

      // Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
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
