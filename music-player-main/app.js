/** 
* The directive tells browser run Javascript under strict mode.
* Declare on top of the page, above every lines of code except comments
*/
'use strict'; 

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const MUSIC_PLAYER_STORAGE = 'musicStorage'

const player = $('.js-player')
const playList = $('.js-playlist')
const diskImg = $('.js-img')
const title = $('.js-title')
const playBtn = $('.js-play')
const nextBtn = $('.js-next')
const prevBtn = $('.js-prev')
const replayBtn = $('.js-replay')
const randomBtn = $('.js-random')
const timeRange = $('.js-time')
const audio = $('.js-audio')


const app = {
    currentSongIndex: 0,
    playedSongIndexs: [],
    isPlaying: false,
    isRandom: false,
    isReplay:false,
    config: JSON.parse(localStorage.getItem(MUSIC_PLAYER_STORAGE)) || {},
    songs: [
        {
            title:'Roi Toi Luon',
            singer:'Nal',
            imgUrl:'./images/roi-toi-luon.jpeg',
            audioSrc:'./audio/roi-toi-luon.mp3'
        },

        {
            title:'Thien Dang',
            singer:'Wowwy & Jolipoli',
            imgUrl:'./images/thien-dang.jpeg',
            audioSrc:'./audio/thien-dang.mp3'
        },

        {
            title:'Hoa Hai Duong',
            singer:'Jack',
            imgUrl:'./images/hoa-hai-duong.jpeg',
            audioSrc:'./audio/hoa-hai-duong.mp3'
        },
    
        {
            title:'Sau Hong Gai',
            singer:'G5R Squad',
            imgUrl:'./images/sau-hong-gai.jpeg',
            audioSrc:'./audio/sau-hong-gai.mp3'
        },
    
        {
            title:'Thuong Nhau Toi Ben',
            singer:'Nal',
            imgUrl:'./images/thuong-nhau-toi-ben.jpeg',
            audioSrc:'./audio/thuong-nhau-toi-ben.mp3'
        },
    
        {
            title:'Khue Moc Lang',
            singer:'Huong Ly',
            imgUrl:'./images/khue-moc-lang.jpeg',
            audioSrc:'./audio/khue-moc-lang.mp3'
        }
    ],
    /****************** DEFINE PROPERTIES ******************/
    defineProperties(){
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentSongIndex]
            }
        })

        Object.defineProperty(this, 'rotate360', {
            get() {
                return {transform: 'rotate(360deg)'}
            }
        })

        Object.defineProperty(this, 'timing10Sec', {
            get() {
                return {duration:10000, iterations:Infinity}
            }
        })
    },
    /****************** SET CONFIG ******************/
    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(MUSIC_PLAYER_STORAGE, JSON.stringify(this.config))
    },


    /****************** LOAD CONFIG ******************/
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isReplay = this.config.isReplay
    },


    /****************** LOAD CURRENT SONG ******************/
    loadCurrentSong() {
        title.textContent = this.currentSong.title
        diskImg.src = this.currentSong.imgUrl
        audio.src = this.currentSong.audioSrc
    },

    /****************** HANDLE EVENTS ******************/
    handleEvents() {
        // keep the function context, in this case: app object
        const that = this

        // [IMG ROTATE ANIMATION]
        const imgAnimation = diskImg.animate(that.rotate360, that.timing10Sec)
        imgAnimation.pause()


        // [SCROLL TOP] --> Make img width change
        const initialImgWidth = diskImg.offsetWidth
        document.onscroll = function (){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newImgWidth = initialImgWidth - scrollTop
            diskImg.style.width = newImgWidth > 0 ? newImgWidth + 'px' : 0
            diskImg.style.opacity = newImgWidth / initialImgWidth
        }


        // [HANDLE PLAY WHEN CLICK]
        playBtn.onclick = function(){  
            that.isPlaying = !that.isPlaying
            that.isPlaying ? audio.play() : audio.pause()  
        }


        // [PLAY EVENT ON AUDIO]
        audio.onplay = function() {
            player.classList.add('playing')
            imgAnimation.play()
        }


        // [PAUSE EVENT ON AUDIO]
        audio.onpause = function() {
            player.classList.remove('playing')
            imgAnimation.pause()
        }


        // [TIMEUPDATE EVENT ON AUDIO]
        audio.ontimeupdate = function(){
            if(audio.duration > 0){
                const currentPercentage = audio.currentTime / audio.duration * 100
                timeRange.value = currentPercentage
            }
        }

        // [SEEK TIME POSITION]
        timeRange.oninput = function() {
            const timePercentage = timeRange.value / 100
            audio.currentTime = timePercentage * audio.duration
        }

        
        function nextSong(){
            that.currentSongIndex++
            if(that.currentSongIndex > that.songs.length - 1) {
                that.currentSongIndex = 0
            }
        }


        function prevSong(){
            that.currentSongIndex--
            if(that.currentSongIndex < 0) {
                that.currentSongIndex = that.songs.length - 1
            }
        }


        function randomSong(){
            if (that.playedSongIndexs.length === that.songs.length - 1) {
                that.playedSongIndexs = []
            }
            do {
                var randomIndex = Math.floor(Math.random() * that.songs.length)
            } while (randomIndex === that.currentSongIndex 
                                        || that.playedSongIndexs.includes(randomIndex))
            
            that.currentSongIndex = randomIndex
            that.playedSongIndexs.push(randomIndex) // store song indexs that are played already in an array

        }

        // [NEXT CLICK EVENT]
        nextBtn.onclick = function() {
            that.isRandom ? randomSong() : nextSong()
            that.loadCurrentSong()
            audio.play()
            that.render()
            setTimeout(function () {
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: "end", 
                    inline: "nearest"
                });
            }, 300)
            
        }

        // [PREV CLICK EVENT]
        prevBtn.onclick = function() {
            that.isRandom ? randomSong() : prevSong()
            that.loadCurrentSong()
            audio.play()
            that.render()
            setTimeout(function () {
                $('.song.active').scrollIntoView({
                    behavior: "smooth", 
                    block: "end", 
                    inline: "nearest"});
            }, 300)
        }

        // [RANDOM SONG WHEN RANDOM BTN ACTIVE]
        randomBtn.onclick = function() {
            randomBtn.classList.toggle('active')
            that.isRandom = !that.isRandom 
            that.setConfig('isRandom', that.isRandom)
        }


        // [REPLAY SONG WHEN REPLAY BTN ACTIVE]
        replayBtn.onclick = function() {
            replayBtn.classList.toggle('active')
            that.isReplay = !that.isReplay
            that.setConfig('isReplay', that.isReplay)
        }

        // [AUDIO ENDED EVENT]
        audio.onended = function() {
            that.isReplay ? audio.play() : nextBtn.click()
        }

        // [ACTIVE SONG BY CLICK]
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song.active')
            const ellipsis = e.target.closest('.ellipsis')
            const clickedSong = e.target.closest('.song')
            if(!songNode && !ellipsis) {
                playList.querySelector('.song.active').classList.remove('active')
                clickedSong.classList.add('active')
                that.currentSongIndex = clickedSong.dataset.index
                that.loadCurrentSong()
                audio.play()
            }
        }
    },

    /****************** RENDER SONGS ******************/
    render() {
        const that = this
        const htmls = this.songs.map(function(song, index) {
            return `
                <li class="song ${index === that.currentSongIndex ? 'active' : ''}" data-index="${index}">
                    <img class="song__thumbnail" src="${song.imgUrl}" all="${song.title}">
                    <div class="song__body">
                        <h2 class="song__title">${song.title}</h2>
                        <p class="song__singer">${song.singer}</p>
                    </div>
                    <button class="ellipsis">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                </li>
            `
        })

        playList.innerHTML = htmls.join('')
    },

    /****************** START ******************/
    start() {
        // set configuration
        this.loadConfig()

        // define custom properties
        this.defineProperties()

        // render songs
        this.render()

        // load current song, default is 0
        this.loadCurrentSong()

        // handle all events
        this.handleEvents()

        // Default UI settings
        if(this.isRandom){
            randomBtn.classList.add('active')
        }
        if(this.isReplay){
            replayBtn.classList.add('active')
        }
        
    }
}

// start application
app.start()