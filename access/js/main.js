/** 
        * 1. Render songs (Playlist)
        * 2. Scroll top
        * 3. Play / Pause / Seek
        * 4. CD rotate
        * 5. Next / Prev
        * 6. Random
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
//Using div block
// const progressArea = $('.progress-area'); 
// const progressBar = $('.progress-bar');
//Using input range
const progress = $('#progress');


const app = {
    curentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isNext: false,
    isPrev: false,
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
        var hmtls = this.songs.map(function (song) {
            return `
             <div class="song">
                 <div class="thumb"
                     style="background-image: url('${song.image}')">
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
        $('.playlist').innerHTML = hmtls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.curentIndex];
            },
        });
    },
    //Handle Events
    handleEvents: function () {
        const _this = this; //assign _this equal to this(app)
        const cdWidth = $('.cd').offsetWidth;

        //Handle cd rotation
        const cdThumpAnimate = cd.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumpAnimate.pause();
        
        //Zoom in/out the cd when scrolled
        document.onscroll = function () {
            const scrollTop = window.scrollY
                || document.documentElement.scrollTop;// Get values ​​from scrolling
            const newCdWidth = cdWidth - scrollTop;// Calculate new cd width

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;// if it's negative then it's 0

            cd.style.opacity = newCdWidth / cdWidth;// Calculate opacity
        }

        //Handle events when click play button
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

            //Listen events when play button is played
            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumpAnimate.play();
            }
            //Listen events when play button is paused
            audio.onpause = function () {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumpAnimate.pause();
            }
        }

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

                //Calculate percentage of progress bar
                let percent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = percent;
            }   
        }
        //Song rewind
        progress.onchange = function () {
            //Calculate seconds of progress bar
            let seekTimes = audio.duration / 100 * progress.value;
            audio.currentTime = seekTimes; // Set seek times to current time
            console.log(audio.currentTime = seekTimes)
        };
    },

    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThump.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    // Get current song when page is reloaded
    // getCurrentSong: function () {
    //     return this.songs[this.curentIndex];
    // },

    start: function () {
        this.defineProperties();    // define properties getter for current song
        this.handleEvents();    // handle events (DOM events)
        // console.log(this.getCurrentSong());

        this.loadCurrentSong(); // Load the first song infor into UI

        this.render();  // Render the playlists
    },
}

app.start();