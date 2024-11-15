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
		const randomIndex = Math.floor(Math.random() * (this.size - 1)) + 1;

		console.log(randomIndex);
		for (let i = 0; i < randomIndex; i++) {
			//console.log( node.next );
			node = node.next === null ? this.head : node.next;
		}
		console.log(node);
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

	setMusicInformation(musicData) {
		this.title = musicData["title"];
		this.singer = musicData["singer"];
		this.cover = `${musicData["cover"]}`;
		this.audio = `${musicData["audio"]}`;
		this.lyrics = `${musicData["lyrics"]}`;
	}
}

class MusicPlayer {
	constructor(id) {
		this.id = id; // 식별자
		// setting music data
		this.musicList = null; // doubly linked list
		this.currentMusic = null; // Music
		this.isShuffle = false; // 셔플 중인가
		this.isPlaying = false; // 노래가 재생 중이면 True 아니면 False
		this.isRepeating = false; // 노래는 반복 재생할거면 True 아니면 False

		// Visible interface HTML Element
		this.song = document.getElementById("song"); // keep
		this.songControl = document.getElementById("songControl");
		this.playToggle = document.getElementById("playToggle");
		this.underMenu = document.getElementById("underMenu");

		this.audioContext = null; // for Equalizer
	}

	setMusicList(musicData) {
		this.musicList = new DoublyLinkedList();
		musicData.forEach(data => {
			const music = new Music(data.id);
			music.setMusicInformation(data)

			this.musicList.append(music);
		});
		//console.log( this.musicList.tail );
		this.currentMusic = this.musicList.head;

	}

	setInterface() { // 화면 표시/ 노래 세팅
		const siteBackground = document.getElementById("siteBackground");
		const coverArea = document.getElementById("coverImg");
		const songTitle = document.getElementById("songTitle");
		const song = document.getElementById("song");
		const singer = document.getElementById("singer");

		coverArea.src = `${this.currentMusic.cover}`;
		siteBackground.style.backgroundImage = `url("${this.currentMusic.cover}")`;

		song.src = this.currentMusic.audio;
		songTitle.innerText = this.currentMusic.title;
		singer.innerText = this.currentMusic.singer;

		this.songControl.value = 0;
		this.playToggle.innerHTML = `<i class="${this.isPlaying ? "xi-pause" : "xi-play"} xi-5x toggleIcon"></i>`

		this.showTrack();
	}

	controlSong() { // Music Control
		const songCurrentTime = document.getElementById("songCurrentTime");
		const songEndTime = document.getElementById("songEndTime");
		const colorChoicer = document.getElementById("colorChoicer");

		this.song.addEventListener("loadedmetadata", () => {
			const minute = String(Math.floor(this.song.duration / 60)).padStart(2, "0");
			const second = String(Math.floor(this.song.duration % 60)).padStart(2, "0");

			songEndTime.innerHTML = `${minute}:${second}`;
		});

		this.songControl.addEventListener("input", () => {
			console.log(this.songControl.value);
			if (this.songControl.value >= 100) {
				this.songControl.value = (this.songControl.value * (this.song.duration - 1)) / 100
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
			songCurrentTime.innerHTML = `${minute}:${second}`;
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

		colorChoicer.addEventListener("input", () => { // easter egg
			console.log(colorChoicer.value)
			const neumorphism = document.querySelectorAll(".neumorphism");
			const smallNeumorphism = document.querySelectorAll(".smallNeumorphism");
			const pressedNeumorphism = document.querySelectorAll(".pressedNeumorphism");
			const songControlB = document.querySelector(".songControl");
			songControlB.style.backgroundColor = `${colorChoicer.value}`;
			smallNeumorphism.forEach((v) => {
				v.style.boxShadow = `5px 5px 10px ${colorChoicer.value}, -5px -5px 10px #ffffff`;
			});
			console.log(neumorphism);
			neumorphism.forEach((v) => {
				v.style.boxShadow = `7px 7px 10px ${colorChoicer.value}, -7px -7px 10px #ffffff`;
			});
			pressedNeumorphism.forEach((v) => {
				v.style.boxShadow = `inset 3px 3px 5px ${colorChoicer.value}, inset -3px -3px 5px #ffffff`;
			});
		});
	}

	clickButtons() { // 클릭 되는 버튼들의 모임
		const nextButton = document.getElementById("next");
		const prevButton = document.getElementById("prev");
		const trackButton = document.getElementById("track");
		const lyricsButton = document.getElementById("lyrics");
		const shuffleButton = document.getElementById("shuffle");
		const underMenuArea = document.getElementById("underMenuArea");
		const underMenuBackground = document.getElementById("underMenuBackground");
		const repeatButton = document.getElementById("repeat");

		this.playToggle.addEventListener("click", () => {
			if (this.isPlaying === false) {
				this.playToggle.classList.replace("smallNeumorphism", "pressedNeumorphism");
				if ( this.audioContext === null ) this.musicEqualizer();
				this.song.play();
			} else {
				this.playToggle.classList.replace("pressedNeumorphism", "smallNeumorphism");
				this.song.pause();
			}
			this.playToggle.innerHTML = `<i class="${this.isPlaying ? "xi-play" : "xi-pause"} xi-5x toggleIcon"></i>`
			this.isPlaying = !this.isPlaying;
		});

		nextButton.addEventListener("click", () => {
			if (this.isShuffle === true) {
				this.getShuffledSong();
			} else {
				this.getNextSong();
			}
		});

		prevButton.addEventListener("click", () => {
			if (this.song.currentTime > (this.song.duration / 10)) {
				this.song.currentTime = 0;
				this.songControl.value = 0;
			} else {
				this.getPrevSong();
			}
		});

		shuffleButton.addEventListener("click", () => {
			this.isShuffle = !this.isShuffle;
			this.isRepeating = false;

			if (this.isShuffle === true) {
				shuffleButton.classList.replace("smallNeumorphism", "pressedNeumorphism");
				repeatButton.classList.replace("pressedNeumorphism", "smallNeumorphism");
				repeatButton.innerHTML = `<i class="${this.isRepeating ? "xi-repeat-one" : "xi-repeat"} xi-2x toggleIcon"></i>`
			} else {
				shuffleButton.classList.replace("pressedNeumorphism", "smallNeumorphism");
			}
		});

		repeatButton.addEventListener("click", () => {
			this.isRepeating = !this.isRepeating;
			this.isShuffle = false;

			if (this.isRepeating === true) {
				repeatButton.classList.replace("smallNeumorphism", "pressedNeumorphism");
				shuffleButton.classList.replace("pressedNeumorphism", "smallNeumorphism");
			} else {
				repeatButton.classList.replace("pressedNeumorphism", "smallNeumorphism");
			}
			repeatButton.innerHTML = `<i class="${this.isRepeating ? "xi-repeat-one" : "xi-repeat"} xi-2x toggleIcon"></i>`
		});

		let isUnderMenuOn = false;
		const equalizerArea = document.getElementById("equalizer");
		trackButton.addEventListener("click", () => {
			isUnderMenuOn = true;

			underMenuBackground.style.display = "block";
			underMenuArea.style.transform = "translateY( calc( -100% + 7rem ) )";
			equalizerArea.style.bottom = "80.5%"; // equalizer도 같이 올라오게
			this.showTrack();
		});

		lyricsButton.addEventListener("click", () => {
			isUnderMenuOn = true;

			underMenuBackground.style.display = "block";
			underMenuArea.style.transform = "translateY( calc( -100% + 7rem ) )";
			equalizerArea.style.bottom = "80.5%"; // equalizer도 같이 올라오게
			this.showLyrics();
		});
		underMenuBackground.addEventListener("click", () => {
			underMenuArea.style.transform = "translateY( 0 )";
			underMenuBackground.style.display = "none";
			equalizerArea.style.bottom = "7rem"; // equalizer도 같이 내려가게
			isUnderMenuOn = false;
		});
	}

	clickKeyboards() { } // 키보드 이벤트

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
				<div id="songList${i}" class="songList pointer" style="background-color: rgba( 0 , 0, 0, 0.15);">
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
			document.getElementById(`songList${i}`).addEventListener("click", () => {
				this.currentMusic = this.musicList.returnNodeFromIndex(i);
				this.setInterface();

				if (this.isPlaying === true) {
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

	musicEqualizer() {
		const equalizerArea = document.getElementById("equalizer");
		const numberOfBar = 50;

		this.audioContext = new AudioContext();
		const musicSource = this.audioContext.createMediaElementSource(this.song);
		const analyzer = this.audioContext.createAnalyser();

		// 오디오 소스 연결
		musicSource.connect(analyzer);
		musicSource.connect(this.audioContext.destination);
		
		const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
		// 막대 생성
		const musicPlayerWidth = document.getElementById("playerArea").offsetWidth; // width 일단 구해
		console.log(musicPlayerWidth/numberOfBar)
		function createBars() {
			for (let i = 0; i < numberOfBar; i++) {
				const bar = document.createElement("div");
				bar.id = `bar${i}`;
				bar.classList.add("equalizerBar");
				bar.style.width = `${musicPlayerWidth/numberOfBar - 2}px`; // -2는 margin 때문임
				equalizerArea.appendChild(bar);
			}
		}

		// 막대 렌더링
		function updateBars() {
			analyzer.getByteFrequencyData(frequencyData);

			for (let i = 0; i < numberOfBar; i++) {
				const bar = document.getElementById(`bar${i}`);
				if (bar) {
					const index = (i+5)*2;
					const fd = frequencyData[index];

					const scaleY = Math.max(0, (fd || 0)**2 / 60000);
					//const scaleY = Math.max(0, (fd || 0) / 300);
					// bar.style.backgroundColor = `rgb(${(fd+255)/2}, 0, 0)`;
					// bar.style.backgroundColor = `rgb(${Math.min(fd, 255)}, ${Math.min(fd, 255)}, ${Math.min(fd, 255)})`;
					bar.style.backgroundColor = `rgb(${Math.min(fd / 2 + 30, 122)}, ${Math.min(fd / 1.5 + 50, 171)}, ${Math.min(fd / 1.7 + 45, 157)})`;
					bar.style.transform = `scaleY(${scaleY})`;
				} else {
					continue;
				}
			}
		}

		function renderFrame() {
			updateBars();
			window.requestAnimationFrame(renderFrame);
		}

		createBars();
		renderFrame();
	}


	readyForStart(musicData) {
		this.setMusicList(musicData); // 노래 데이터 세팅
		this.setInterface(); // 화면 표시
		this.controlSong(); // 노래 재생
		this.clickButtons(); // 이전 / 다음 / 시작 버튼 기능 세팅
	}
}

const startMusicPlayer = (async () => {
	const settings = {
		method: "POST",
		headers: {
			"Accept": 'application/json',
			"Content-Type": 'application/json',
		}
	};
	try {
		const response = await fetch("/musicData", settings);
		const musicData = await response.json();

		console.log(musicData);
		const musicPlayer = new MusicPlayer("main");
		musicPlayer.readyForStart(musicData);
	} catch (err) {
		console.error(err);
	}
})();
