/** 
        * 1. Render songs (Playlist)
        * 2. Scroll top
        * 3. Play / Pause / Seek
        * 4. CD rotate
        * 5. Next / Prev
        * 6. Random / Repeat
        * 7. Next / Repeat when ended
        * 8. Active song
        * 9. Scroll active song into view
        * 10. Play song when click
        */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('header h2');
const cdThump = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
//Using div block
// const progressArea = $('.progress-area'); 
// const progressBar = $('.progress-bar');
//Using input range
const progress = $('#progress');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Save',
            singer: 'Faime',
            path: './access/musics/Faime-Save.mp3',
            image: './access/images/Faime-Save.jpg'
        },
        {
            name: 'As i write you this letter',
            singer: 'jomie',
            path: './access/musics/jomie-as-i-write-you-this-letter.mp3',
            image: './access/images/jomie-as-i-write-you-this-letter.jpg'
        },
        {
            name: 'The show goes on',
            singer: 'kennedyxoxo',
            path: './access/musics/kennedyxoxo_theshowgoeson.mp3',
            image: './access/images/kennedyxoxo_theshowgoeson.jpg'
        },
        {
            name: 'Fck Love',
            singer: 'Lund',
            path: './access/musics/Lund-Fck-Love.mp3',
            image: './access/images/Lund-Fck-Love.jpg'
        },
        {
            name: 'Out Of Time',
            singer: 'Lund',
            path: './access/musics/Lund-Out-Of-Time.mp3',
            image: './access/images/Lund-Out-Of-Time.jpg'
        },
        {
            name: 'lightning',
            singer: 'mehro',
            path: './access/musics/mehro-lightning.mp3',
            image: './access/images/mehro-lightning.jpg'
        },
        {
            name: 'ecstasy',
            singer: 'nekoi',
            path: './access/musics/nekoi-ecstasy.mp3',
            image: './access/images/nekoi-ecstasy.jpg'
        },
        {
            name: 'Read Your Mind',
            singer: 'Pardyalone',
            path: './access/musics/Pardyalone-Read-Your-Mind.mp3',
            image: './access/images/Pardyalone-Read-Your-Mind.jpg'
        },
        {
            name: 'Surface',
            singer: 'Sinxi',
            path: './access/musics/Sinxi-Surface.mp3',
            image: './access/images/Sinxi-Surface.jpg'
        },
        {
            name: 'I saw you by the water',
            singer: 'skele',
            path: './access/musics/skele-i-saw-you-by-the-water.mp3',
            image: './access/images/skele-i-saw-you-by-the-water.jpg'
        },
    ],

    //Render song to playlist
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
             <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                 <div class="thumb" style="background-image: url('${song.image}')">
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
        })
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this; //assign _this equal to this(app)
        const cdWidth = $('.cd').offsetWidth;

        //Handle cd rotation
        const cdThumpAnimate = cd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumpAnimate.pause();

        //Zoom in/out the cd when scrolled
        document.onscroll = function () {
            const scrollTop = window.scrollY
                || document.documentElement.scrollTop; // Get values ​​from scrolling
            const newCdWidth = cdWidth - scrollTop; // Calculate new cd width

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; // if it's negative then it's 0

            cd.style.opacity = newCdWidth / cdWidth; // Calculate opacity
        };

        //Handle events when click play button
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //Listen events when play button is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumpAnimate.play();
        };
        //Listen events when play button is paused
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumpAnimate.pause();
        };

        //Using div block
        // audio.ontimeupdate = function () {
        //     if (audio.duration) {
        //         const percent = (audio.currentTime / audio.duration) * 100;
        //         progressBar.style.width = `${percent}%`;
        //     }
        // }
        // progressArea.addEventListener('click', function (e) {
        //     const progressAreaWidth = progressArea.clientWidth;
        //     const progressBarClick = e.offsetX;
        //     const songDuration = audio.duration;
        //     audio.currentTime = (progressBarClick / progressAreaWidth) * songDuration
        // })
        //Using input range
        //Progress bar runs parallel to the song 
        audio.ontimeupdate = function () {
            if (audio.duration) {
                let percent = Math.floor((audio.currentTime / audio.duration) * 100); //Calculate percentage of progress bar
                progress.value = percent;
            }
        };
        //Song rewind
        progress.onchange = function () {
            let seekTimes = audio.duration / 100 * progress.value; //Calculate seconds of progress bar
            audio.currentTime = seekTimes; // Set seek times to current time
        };

        //Handle events when click next button
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            nextBtn.classList.add('active');
            setTimeout(function () {
                nextBtn.classList.remove('active');
            }, 100);
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        //Handle events when click prev button
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            prevBtn.classList.add('active');
            setTimeout(function () {
                prevBtn.classList.remove('active');
            }, 100);
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        //Handle events when click random button
        randomBtn.onclick = function () {
            //Solution 1
            // if (_this.isRandom) {
            //     randomBtn.classList.remove('active');
            //     _this.isRandom = false;
            // } else {
            //     randomBtn.classList.add('active');
            //     _this.isRandom = true;
            // }
            //Solution 2
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        };
        //Handle events when click repeat button
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Handle song playlist click events
        playList.onclick = function (e) {
            const songNode =e.target.closest('.song:not(.active)');
            if (songNode ||
                e.target.closest('.option')) { //If it doesn't have active or have option then run

                if(songNode) {
                    // songNode.getAttribute('data-index') //slt 1
                    // songNode.dataset.index //slt 2 .//dataset.index return string
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };
        //Handle events when the song ended
        audio.onended = function () {
            //Solution 1: Write another function to assign to the nextBtn.onclick event
            //Then call that fucntion right here
            if (_this.isRepeat) {
                _this.repeatSong();
            } else {
                //Soltion 2
                nextBtn.click();//Auto click when the song ends
            }
        };

    },

    //Render current song
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThump.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    // Get current song when page is reloaded
    // getCurrentSong: function () {
    //     return this.songs[this.currentIndex];
    // },

    // Skip to next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Skip to prev song
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    //Random button
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    //Repeat song
    repeatSong: function () {
        audio.play();// Play the current song again
    },

    //Scroll active song into view
    scrollToActiveSong: function () {
        //Solution 1
        let viewRange = '';
        if (this.currentIndex === 0) {
            viewRange = 'end';
        } else {
            viewRange = 'center'
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth", block: viewRange
            })
        }, 100)
        //Solution 2
        // if(this.currentIndex === 0) {
        //     setTimeout(() => {
        //         $('.song.active').scrollIntoView({
        //             behavior: "smooth", block: "end" 
        //         })
        //     }, 100)
        // }
        // else {
        //     setTimeout(() => {
        //         $('.song.active').scrollIntoView({
        //             behavior: "smooth", block: "center" 
        //         })
        //     }, 100)
        // }
    },

    start: function () {
        this.defineProperties();    // define properties getter for current song
        this.handleEvents();    // handle events (DOM events)

        this.loadCurrentSong(); // Load the first song infor into UI

        this.render();  // Render the playlists
    },
}

app.start();