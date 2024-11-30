const songList = [
    {
        "img": "Andha Aruvi Pol Anbai Tharuvaal.png",
        "title": "Andha Aruvi Pol Anbai Tharuvaal"
    },
    {
        "img": "En Uyir Neethane.png",
        "title": "En Uyir Neethane"
    },
    {
        "img": "Leo Das Entry.png",
        "title": "Leo Das Entry"
    },
    {
        "img": "Oru Naalil.png",
        "title": "Oru Naalil"
    },
    {
        "img": "Sara Sara Pamba.png",
        "title": "Sara Sara Pamba"
    },
    {
        "img": "Sindhiya Venmani.png",
        "title": "Sindhiya Vennmani"
    },
    {
        "img": "Thatha Thatha Konjam Podi Kodu.png",
        "title": "Thatha Thatha Konjam Podi Kodu"
    },
    {
        "img": "Unch Maza Zoka.png",
        "title": "Unch Maza Zoka"
    }
]

// const songList =[];

let favSongList = [];

let currActiveSong = null;

let currSong = 0;

function pageOnload(){
    document.getElementById('song-img').src = "img/"+songList[0]["img"];
    document.getElementById('mp3-song-title').innerText = songList[0]["title"];
    document.querySelector('.audio').src = "songs/"+songList[0]["title"]+".mp3";

    //songList ==> JSON
    songList.forEach((song)=>{
        document.getElementById("song-list").appendChild(songCardUsinTemplete(song));
    })

    currActiveSong = document.getElementById('song-list').firstElementChild;
    console.log(currActiveSong);
}

/* song-card template*/
function songCardUsinTemplete(eachSong) {
    const template = document.getElementById('song-card-template');
    const songCard = template.content.cloneNode(true);
    
    songCard.querySelector('.song-avathar').src = "img/"+eachSong["img"];
    songCard.querySelector('.song-title').textContent = eachSong["title"];
    
    return songCard;
}

/* show favorite song list */
function showFavList(){
    document.getElementById("song-list").style = 'display: none';
    document.getElementById("fav-song-list").style = 'display: block';
}

/* show all song */
function showHomeList(){
    document.getElementById("song-list").style = 'display: block';
    document.getElementById("fav-song-list").style = 'display: none';
}

document.addEventListener('click', (event) => {
    // event.preventDefault();

    const t = event.target;

    if (t.classList.contains('fav-icon-en')){
        const parent = t.parentElement;
        parent.querySelector('.fav-icon-en').style.display = 'none';
        parent.querySelector('.fav-icon-dis').style.display = 'block';
        document.getElementById('fav-song-list').appendChild(parent.cloneNode(true));
    } else if (t.classList.contains('fav-icon-dis')){
        const parent = t.parentElement;
        const favDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        const songDiv = document.getElementById('song-list').querySelectorAll('.song-card');
        favDiv.forEach((div) => {
            if(div.isEqualNode(parent)){
                songDiv.forEach(s => {
                    if(s.isEqualNode(parent)){
                        s.querySelector('.fav-icon-en').style.display = 'block';
                        s.querySelector('.fav-icon-dis').style.display = 'none';
                    }
                })
                div.remove();
            }
        })
    } else if (t.classList.contains('play-btn')){
        const parent = t.parentElement;
        const mp3Card = document.getElementById('mp3-card');
        
        mp3Card.querySelector('#song-img').src = parent.querySelector('.song-avathar').src;
        mp3Card.querySelector('#mp3-song-title').innerText = parent.querySelector('.song-title').innerText;
        mp3Card.querySelector('.audio').src = "songs/"+parent.querySelector('.song-title').innerText+".mp3";
        mp3Card.querySelector('.audio').play();
        
        const songDiv = document.getElementById('song-list').querySelectorAll('.song-card');
        songDiv.forEach(s => {
            if (s.querySelector('.play-btn').style.display == 'none') {
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
        
        currActiveSong = parent;

        songDiv.forEach((s, ind) => {
            if(s.isEqualNode(currActiveSong)){
                currSong = ind;
            }
            ind++;
        })
        
        parent.querySelector('.play-btn').style.display = 'none';
        parent.querySelector('.pause-btn').style.display = 'block';

        const favSongDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        favSongDiv.forEach((s) => {
            if(s.isEqualNode(parent)){
                s.querySelector('.play-btn').style.display = 'none';
                s.querySelector('.pause-btn').style.display = 'block';
            }
        })
        document.querySelector('.mp3-play-btn').style.display = 'none';
        document.querySelector('.mp3-pause-btn').style.display = 'block';

    } else if (t.classList.contains('pause-btn')) {
        t.parentElement.querySelector('.pause-btn').style.display = 'none';
        t.parentElement.querySelector('.play-btn').style.display = 'block';
        document.querySelector('.mp3-play-btn').style.display = 'block';
        document.querySelector('.mp3-pause-btn').style.display = 'none';
        document.querySelector('.audio').pause();
        const favSongDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        favSongDiv.forEach((s) => {
            if(s.isEqualNode(t.parentElement)){
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
    } else if (t.classList.contains('mp3-play-btn')) {
        // console.log(t);
        document.querySelector('.audio').play();
        const songDiv = document.getElementById('song-list').querySelectorAll('.song-card');
        songDiv.forEach((s) => {
            if(s.isEqualNode(currActiveSong)){
                s.querySelector('.play-btn').style.display = 'none';
                s.querySelector('.pause-btn').style.display = 'block';
            }
        })
        const favSongDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        favSongDiv.forEach((s) => {
            if(s.isEqualNode(currActiveSong)){
                s.querySelector('.play-btn').style.display = 'none';
                s.querySelector('.pause-btn').style.display = 'block';
            }
        })
        t.parentElement.querySelector('.mp3-play-btn').style.display = 'none';
        t.parentElement.querySelector('.mp3-pause-btn').style.display = 'block';
    } else if (t.classList.contains('mp3-pause-btn')){
        document.querySelector('.audio').pause();
        const songDiv = document.getElementById('song-list').querySelectorAll('.song-card');
        songDiv.forEach((s) => {
            if(s.isEqualNode(currActiveSong)){
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
        const favSongDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        favSongDiv.forEach((s) => {
            if(s.isEqualNode(currActiveSong)){
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
        t.parentElement.querySelector('.mp3-play-btn').style.display = 'block';
        t.parentElement.querySelector('.mp3-pause-btn').style.display = 'none';
    } else if (t.classList.contains('prev')){
        currSong--;
        if(currSong < 0){
            currSong = songList.length - 1;
        }
        currActiveSong = document.getElementById('song-list').children[currSong];
        document.getElementById('song-img').src = currActiveSong.querySelector('.song-avathar').src;
        document.getElementById('mp3-song-title').innerText = currActiveSong.querySelector('.song-title').innerText;
        document.querySelector(".audio").src = "songs/"+currActiveSong.querySelector('.song-title').innerText+".mp3";
    } else if (t.classList.contains('next')){
        currSong++;
        if(currSong >= songList.length){
            currSong = 0;
        }
        currActiveSong = document.getElementById('song-list').children[currSong];
        document.getElementById('song-img').src = currActiveSong.querySelector('.song-avathar').src;
        document.getElementById('mp3-song-title').innerText = currActiveSong.querySelector('.song-title').innerText;
        document.querySelector(".audio").src = "songs/"+currActiveSong.querySelector('.song-title').innerText+".mp3";
    }

});

document.getElementById('progress-bar').addEventListener('input', e => {
    document.querySelector('.audio').currentTime = document.getElementById('progress-bar').value;
})

document.querySelector('.audio').onloadedmetadata = () => {
    document.getElementById('progress-bar').max = document.querySelector('.audio').duration;
    document.getElementById('progress-bar').value = document.querySelector('.audio').currentTime;
    document.getElementById('current-time').innerText = Math.floor(document.querySelector('.audio').currentTime/60) +":"+ Math.floor(document.querySelector('.audio').currentTime%60);
    document.getElementById('max-time').innerText = Math.floor(document.querySelector('.audio').duration/60) +":"+ Math.floor(document.querySelector('.audio').duration%60);
}

if(document.querySelector('.audio').play()){
    setInterval(() => {
        document.getElementById('progress-bar').value = document.querySelector('.audio').currentTime;
        document.getElementById('current-time').innerText = Math.floor(document.querySelector('.audio').currentTime/60) +":"+ Math.floor(document.querySelector('.audio').currentTime%60);
        document.getElementById('max-time').innerText = Math.floor(document.querySelector('.audio').duration/60) +":"+ Math.floor(document.querySelector('.audio').duration%60);
    }, 500);
}


pageOnload();
