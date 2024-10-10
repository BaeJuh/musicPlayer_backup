class DoublyLinkedList {
	constructor() {
		this._head = null;
		this._tail = null;
		this._size = 0;

		this.test = " "; // print용 임시 변수
	}
	set head(node) {
		this._head = node;
	}
	get head() {
		return this._head;
	}
	set tail(node) {
		this._tail = node;
	}
	get tail() {
		return this._tail;
	}
	get size() {
		return this._size;
	}

	append(node) {
		if (this.size === 0) {
			this.head = node;
			this.tail = node;
		} else { // 맨 뒤 삽입 기준
			node.prev = this.tail;
			this.tail.next = node;
			this.tail = node;
		}

		this._size++;
	}
	returnNodeFromIndex(index) { // 노드는 head를 넣음
		if (index < this.size) {
			let node = this.head;
			if (index === 0) {
				return node;
			} else {
				for (let i = 0; i < index; i++) {
					node = node.next;
				}
				return node;
			}

		} else {
			return null;
		}
	}
	returnShuffleNode(node) { // random 값 만큼 순환 후 node 반환
		const randomIndex = Math.floor(Math.random() * (this.size - 1) ) + 1;
		
		console.log(randomIndex);
		for (let i = 0; i < randomIndex ; i++) {
			//console.log( node.next );
			node = node.next === null ? this.head : node.next;
		}
		console.log( node );
		return node;
	}
	printNodes(node) {
		console.log(`현재 ${this.size}개의 곡이 있습니다.`)
		if (node.next != null) {
			this.test += node.title + " \n ";
			this.printNodes(node.next);
		} else {
			this.test += node.title + " \n ";
			console.log(this.test);
			return
		}
	}
}

class Music {
	constructor(id) {
		this.id = id;
		this.title = "";
		this.singer = "";
		this.cover = ""; // URL
		this.audio = "";
		this.lyrics = "";

		this._next = null;
		this._prev = null;
	}
	set next(nextNode) {
		this._next = nextNode;
	}
	get next() {
		return this._next;
	}
	set prev(prevNode) {
		this._prev = prevNode;
	}
	get prev() {
		return this._prev;
	}

	setMusicInformation(musicJson) {
		this.title = musicJson["title"];
		this.singer = musicJson["singer"];
		this.cover = `${musicJson["cover"]}`;
		this.audio = `${musicJson["audio"]}`;
		this.lyrics = `${musicJson["lyrics"]}`;
	}
}

class MusicPlayer {
	constructor(MusicJson) {
		// setting music data
		this.musicJson = MusicJson; // json file
		this.musicList = null; // doubly linked list

		//
		this.currentMusic = null; // Music
		this.currentMusicDuration = 0;
		this.isShuffle = false;
		this.isPlaying = false; // 노래가 재생 중이면 True 아니면 False
		this.isRepeating = false; // 노래는 반복 재생할거면 True 아니면 False
		this.isUnderMenuOn = false; // UnderMenu가 열려있는지 없는지

		// Visible interface HTML Element
		this.playerArea = document.getElementById("playerArea"); // 플레이어 배경
		this.siteBackground = document.getElementById("siteBackground"); // 전체 배경 ( 블러 처리된 )
		this.coverArea = document.getElementById("coverImg"); // 앨범 사진
		this.songTitle = document.getElementById("songTitle"); // 노래 제목
		this.singer = document.getElementById("singer"); // 가수

		this.song = document.getElementById("song");
		this.songControl = document.getElementById("songControl");
		this.songCurrentTime = document.getElementById("songCurrentTime");
		this.songEndTime = document.getElementById("songEndTime");

		this.shuffleButton = document.getElementById("shuffle"); // 랜덤 곡 버튼
		this.prevButton = document.getElementById("prev"); // 이전 곡 버튼
		this.playToggle = document.getElementById("playToggle"); // 시작/멈춤 버튼
		this.nextButton = document.getElementById("next"); // 다음 곡 버튼
		this.repeatButton = document.getElementById("repeat"); // 반복 버튼

		this.underMenuArea = document.getElementById("underMenuArea");
		this.trackButton = document.getElementById("track");
		this.lyricsButton = document.getElementById("lyrics");
		this.underMenu = document.getElementById("underMenu");
		this.underMenuBackground = document.getElementById("underMenuBackground");

		this.colorChoicer = document.getElementById("colorChoicer");
	}

	setMusicList() {
		//console.log( this.musicJson );
		this.musicList = new DoublyLinkedList();
		for (const key in this.musicJson) {
			const musicInfo = this.musicJson[key];
			const music = new Music(key);
			music.setMusicInformation(musicInfo);

			//console.log( music.title );
			this.musicList.append(music);


		}
		//console.log( this.musicList.tail );
		this.currentMusic = this.musicList.head;

	}

	setInterface() { // 화면 표시/ 노래 세팅
		this.coverArea.src = `${this.currentMusic.cover}`;
		this.siteBackground.style.backgroundImage = `url("${this.currentMusic.cover}")`;

		this.song.src = this.currentMusic.audio;
		this.songTitle.innerText = this.currentMusic.title;
		this.singer.innerText = this.currentMusic.singer;

		this.songControl.value = 0;
		this.playToggle.innerHTML = `<i class="${this.isPlaying ? "xi-pause" : "xi-play"} xi-5x toggleIcon"></i>`

		this.showTrack();
	}

	controlSong() { // Music Control
		this.song.addEventListener("loadedmetadata", () => {
			const minute = String(Math.floor(this.song.duration / 60)).padStart(2, "0");
			const second = String(Math.floor(this.song.duration % 60)).padStart(2, "0");

			this.songEndTime.innerHTML = `${minute}:${second}`;
		});

		this.songControl.addEventListener("input", () => {
			console.log(this.songControl.value);
			if ( this.songControl.value >= 100 ) {
				this.songControl.value = ( this.songControl.value * ( this.song.duration - 1)) / 100
			} else {
				this.song.currentTime = (this.songControl.value * this.song.duration) / 100;
			}
		});

		this.song.addEventListener("timeupdate", () => { // 노래가 진행될 동안 생길 이벤트
			if (this.isPlaying === true) {
				this.songControl.value = isNaN((this.song.currentTime / this.song.duration) * 100) ? 0 : (this.song.currentTime / this.song.duration) * 100;
			}
			// 노래 시간 설정
			const minute = String(Math.floor(this.song.currentTime / 60)).padStart(2, "0");
			const second = String(Math.floor(this.song.currentTime % 60)).padStart(2, "0");
			this.songCurrentTime.innerHTML = `${minute}:${second}`;
			//노래 넘기기
			if (this.song.currentTime === this.song.duration && this.isRepeating === false) {
				//this.getNextSong();
				if (this.isShuffle === true) {
					this.getShuffledSong();
				} else {
					this.getNextSong();
				}
			} else if (this.song.currentTime === this.song.duration && this.isRepeating === true) {
				this.currentMusic = this.currentMusic;
				//this.setInterface();
				if (this.isPlaying === true) {
					this.song.play();
				}
			}
		});

		this.colorChoicer.addEventListener("input", () => {
			console.log( this.colorChoicer.value )
			const neumorphism = document.querySelectorAll(".neumorphism");
			const smallNeumorphism = document.querySelectorAll(".smallNeumorphism");
			const pressedNeumorphism = document.querySelectorAll(".pressedNeumorphism");
			const songControlB = document.querySelector(".songControl");
			songControlB.style.backgroundColor = `${this.colorChoicer.value}`;
			smallNeumorphism.forEach( (v) => {
				v.style.boxShadow = `5px 5px 10px ${this.colorChoicer.value}, -5px -5px 10px #ffffff`;
			});
			console.log( neumorphism );
			neumorphism.forEach( (v) => {
				v.style.boxShadow = `7px 7px 10px ${this.colorChoicer.value}, -7px -7px 10px #ffffff`;
			});
			pressedNeumorphism.forEach((v) => {
				v.style.boxShadow = `inset 3px 3px 5px ${this.colorChoicer.value}, inset -3px -3px 5px #ffffff`;
			});
		});
	}

	clickButtons() { // 클릭 되는 버튼들의 모임
		this.playToggle.addEventListener("click", () => {
			this.isPlaying = !this.isPlaying;
			if (this.isPlaying === true) {
				this.playToggle.classList.replace( "smallNeumorphism", "pressedNeumorphism" );
				this.song.play();
			} else {
				this.playToggle.classList.replace( "pressedNeumorphism", "smallNeumorphism" );
				this.song.pause();
			}
			//console.log( this.song.duration )
			this.playToggle.innerHTML = `<i class="${this.isPlaying ? "xi-pause" : "xi-play"} xi-5x toggleIcon"></i>`
		});

		this.nextButton.addEventListener("click", () => {
			if (this.isShuffle === true) {
				this.getShuffledSong();
			} else {
				this.getNextSong();
			}
		});

		this.prevButton.addEventListener("click", () => {
			if (this.song.currentTime > (this.song.duration / 10)) {
				this.song.currentTime = 0;
				this.songControl.value = 0;
			} else {
				this.getPrevSong();
			}
		});

		this.shuffleButton.addEventListener("click", () => {
			this.isShuffle = !this.isShuffle;
			this.isRepeating = false;

			if ( this.isShuffle === true ) {
				this.shuffleButton.classList.replace( "smallNeumorphism", "pressedNeumorphism" );
				this.repeatButton.classList.replace( "pressedNeumorphism", "smallNeumorphism" );
				this.repeatButton.innerHTML = `<i class="${this.isRepeating ? "xi-repeat-one" : "xi-repeat"} xi-2x toggleIcon"></i>`
			} else {
				this.shuffleButton.classList.replace( "pressedNeumorphism", "smallNeumorphism" );
			}
		});

		this.repeatButton.addEventListener("click", () => {
			this.isRepeating = !this.isRepeating;
			this.isShuffle = false;

			if ( this.isRepeating === true ) {
				this.repeatButton.classList.replace( "smallNeumorphism", "pressedNeumorphism" );
				this.shuffleButton.classList.replace( "pressedNeumorphism", "smallNeumorphism" );
			} else {
				this.repeatButton.classList.replace( "pressedNeumorphism", "smallNeumorphism" );
			}
			this.repeatButton.innerHTML = `<i class="${this.isRepeating ? "xi-repeat-one" : "xi-repeat"} xi-2x toggleIcon"></i>`
		});

		this.trackButton.addEventListener("click", () => {
			this.isUnderMenuOn = true;

			this.underMenuBackground.style.display = "block";
			this.underMenuArea.style.transform = "translateY( calc( -100% + 3.5rem ) )";
			this.showTrack();
			
		});

		this.lyricsButton.addEventListener("click", () => {
			this.isUnderMenuOn = true;

			this.underMenuBackground.style.display = "block";
			this.underMenuArea.style.transform = "translateY( calc( -100% + 3.5rem ) )";
			this.showLyrics();
		});
		this.underMenuBackground.addEventListener("click", () => {
			this.underMenuArea.style.transform = "translateY( 0 )";
			this.underMenuBackground.style.display = "none";
			this.isUnderMenuOn = false;
		});
	}

	clickKeyboards() {} // 키보드 이벤트

	getNextSong() { // 다음 곡 불러오기
		this.currentMusic = this.currentMusic === this.musicList.tail ? this.musicList.head : this.currentMusic.next;

		this.setInterface();
		if (this.isPlaying === true) {
			this.song.play();
		}
	}

	getPrevSong() { // 이전 곡 불러오기
		this.currentMusic = this.currentMusic === this.musicList.head ? this.musicList.tail : this.currentMusic.prev;
		//this.isPlaying = false;
		this.setInterface();
		if (this.isPlaying === true) {
			this.song.play();
		}
	}

	getShuffledSong() { // 랜덤 노래 찾기
		this.currentMusic = this.musicList.returnShuffleNode(this.currentMusic);
		this.setInterface();
		if (this.isPlaying === true) {
			this.song.play();
		}
	}

	showTrack() { // Show Track List
		this.underMenu.innerHTML = "";
		for (let i = 0; i < this.musicList.size; i++) {
			const music = this.musicList.returnNodeFromIndex(i);
			this.underMenu.innerHTML += music === this.currentMusic ? `
				<div id="songList${i}" class="songList pointer" style="background-color: rgba( 255 , 0, 0, 0.3);">
					<img src="${music.cover}" />
					<p class="songListPara">${music.title}<br>${music.singer}</p>
				</div>
			` : `
				<div id="songList${i}" class="songList pointer">
					<img src="${music.cover}" />
					<p class="songListPara">${music.title}<br>${music.singer}</p>
				</div>
			`;
		}
		this.underMenu.innerHTML += `
		<div id="dummy" class="songList" style="height: 5rem;"></div>
		`;
		for (let i = 0; i < this.musicList.size; i++) {
			document.getElementById(`songList${i}`).addEventListener("click", ()=>{
				this.currentMusic = this.musicList.returnNodeFromIndex( i );
				this.setInterface();

				if ( this.isPlaying === true ) {
					this.song.play();
				}
			});
		}
	}

	showLyrics() {
		this.underMenu.innerHTML = `
			<p id="underLyrics" class="underLyrics">
				${this.currentMusic.lyrics}
			</p>
		`;
	}

	readyForStart() {
		this.setMusicList(); // 노래 데이터 세팅
		this.setInterface(); // 화면 표시
		this.controlSong(); // 노래 재생
		this.clickButtons(); // 이전 / 다음 / 시작 버튼 기능 세팅
	}
}

const main = (() => {
	console.log("Page is ready");

	const musicPlayer = new MusicPlayer(JSON.parse(JSON.stringify(MusicJson)));
	musicPlayer.readyForStart();
})();