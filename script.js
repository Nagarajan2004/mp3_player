let songList=[];

let favSongList = [];

let currActiveSong = null;

let currSong = 0;

async function fetchData() {
    try {
        const req = await fetch("http://localhost:8080/mp3_player_backend/song", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        songList = await req.json();
        pageOnload();
    } catch (error) {
        console.log(error);
    }
}
fetchData();

function pageOnload(){
    // document.getElementById('song-img').src = "img/"+songList[0]["img"];
    // document.getElementById('mp3-song-title').innerText = songList[0]["title"];
    // document.querySelector('.audio').src = "songs/"+songList[0]["title"]+".mp3";

    //songList ==> JSON
    songList.forEach((song)=>{
        document.getElementById("song-list").appendChild(songCardUsingTemplate(song));
    })

    currActiveSong = document.getElementById('song-list').children[1];
    // console.log(currActiveSong);
    document.getElementById('song-img').src = currActiveSong.querySelector('.song-avathar').src;
    document.getElementById('mp3-song-title').innerText = currActiveSong.querySelector('.song-title').innerText;
}


/* song-card template*/
function songCardUsingTemplate(eachSong) {
    const template = document.getElementById('song-card-template');
    const songCard = template.content.cloneNode(true);

    const imgStr = atob(eachSong["img"]);
    let len = imgStr.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = imgStr.charCodeAt(i);
    }
    const imgBlob = new Blob([bytes], { type: 'image/png' });

    const audioStr = atob(eachSong["audio"]);
    len = audioStr.length;
    bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = audioStr.charCodeAt(i);
    }
    const audioBlob = new Blob([bytes], { type: 'audio/mp3' });

    const imgUrl = URL.createObjectURL(imgBlob);
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log(audioBlob)
    songCard.querySelector('.song-avathar').src = imgUrl;
    songCard.querySelector('.audio-src').src = audioUrl;
    songCard.querySelector('.audio').load();

    songCard.querySelector('.song-title').innerText = eachSong["song-title"];

    // console.log(eachSong);
    
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
        console.log(parent);
        parent.querySelector('.audio').play();
        
        currActiveSong = parent;
        const songDiv = document.getElementById('song-list').querySelectorAll('.song-card');
        songDiv.forEach(s => {
            if (s.isEqualNode(parent)) {
                s.querySelector('.play-btn').style.display = 'none';
                s.querySelector('.pause-btn').style.display = 'block';
            } else {
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
        
        const favSongDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        favSongDiv.forEach((s) => {
            if(s.querySelector('.song-title').innerText == parent.querySelector('.song-title').innerText){
                s.querySelector('.play-btn').style.display = 'none';
                s.querySelector('.pause-btn').style.display = 'block';
            } else {
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
        
        songDiv.forEach((s, ind) => {
            if(s.isEqualNode(currActiveSong)){
                currSong = ind;
            }
            ind++;
        })
        
        parent.querySelector('.play-btn').style.display = 'none';
        parent.querySelector('.pause-btn').style.display = 'block';

        document.querySelector('.mp3-play-btn').style.display = 'none';
        document.querySelector('.mp3-pause-btn').style.display = 'block';

        parent.querySelector('.audio').play().then(() => {
            setInterval(() => {
                const currentTime = audio.currentTime;
                const duration = audio.duration;
                document.getElementById('progress-bar').value = (currentTime / duration) * 100;
                document.getElementById('current-time').innerText = 
                    Math.floor(currentTime / 60) + ":" + String(Math.floor(currentTime % 60)).padStart(2, '0');
                document.getElementById('max-time').innerText = 
                    Math.floor(duration / 60) + ":" + String(Math.floor(duration % 60)).padStart(2, '0');
            }, 500);
        }).catch(error => {
            console.log('Failed to play audio:', error);
        });

    } else if (t.classList.contains('pause-btn')) {
        t.parentElement.querySelector('.pause-btn').style.display = 'none';
        t.parentElement.querySelector('.play-btn').style.display = 'block';
        document.querySelector('.mp3-play-btn').style.display = 'block';
        document.querySelector('.mp3-pause-btn').style.display = 'none';
        t.parentElement.querySelector('.audio').pause();
        const favSongDiv = document.getElementById('fav-song-list').querySelectorAll('.song-card');
        favSongDiv.forEach((s) => {
            if(s.querySelector('.play-btn').style.display = 'none'){
                s.querySelector('.play-btn').style.display = 'block';
                s.querySelector('.pause-btn').style.display = 'none';
            }
        })
    } else if (t.classList.contains('mp3-play-btn')) {
        currActiveSong.querySelector('.audio').play();
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
        currActiveSong.querySelector('.audio').pause();
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
    } else if (t.classList.contains('next')){
        currSong++;
        if(currSong >= songList.length){
            currSong = 0;
        }
        currActiveSong = document.getElementById('song-list').children[currSong];
        document.getElementById('song-img').src = currActiveSong.querySelector('.song-avathar').src;
        document.getElementById('mp3-song-title').innerText = currActiveSong.querySelector('.song-title').innerText;
    }

});

document.getElementById('progress-bar').addEventListener('input', e => {
    document.querySelector('.audio').currentTime = document.getElementById('progress-bar').value;
})

if(document.querySelector('.audio-src')){
    document.querySelector('.audio').onloadedmetadata = () => {
        document.getElementById('progress-bar').max = document.querySelector('.audio').duration;
        document.getElementById('progress-bar').value = document.querySelector('.audio').currentTime;
        document.getElementById('current-time').innerText = Math.floor(document.querySelector('.audio').currentTime/60) +":"+ Math.floor(document.querySelector('.audio').currentTime%60);
        document.getElementById('max-time').innerText = Math.floor(document.querySelector('.audio').duration/60) +":"+ Math.floor(document.querySelector('.audio').duration%60);
    }
}

