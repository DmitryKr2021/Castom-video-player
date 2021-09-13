console.log(`Самооценка:  Score: 30 / 30
•	Код HTML-CSS-JS написан полностью самостоятельно - 10 баллов
•	Проект дополнен обязательным дополнительным функционалом, указанным в описании задания - 10 баллов
•	Проект дополнен дополнительным функционалом двух типов. 
2x10 = 20 баллов
Обязательный дополнительный функционал
Управление плеером с клавиатуры: 1) клавиша Пробел — пауза, 2) Клавиша M (англ) — отключение/включение звука, 3) Клавиша > — ускорение воспроизведения ролика, 4) Клавиша < — замедление воспроизведения ролика, 5) Клавиша F — включение/выключение полноэкранного режим. Дополнительный функционал 1) Клавиши Стрелки вверх и вниз - увеличить или уменьшить громкость на 10% 2) Клавиша с цифрой 0 - перейти к началу видео 3) слайдер видеороликов. Сделан на основе бесконечного слайдера из первой части.`);

/**********************************/
/***********Слайдер****************/
/**********************************/
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const body = document.querySelector('body');
const bgcolor = ['#dbeeec', '#d0f3a9', '#f1a9f3', '#f2f89e'];
const slideWidth = 1050;
let slideItems = document.querySelector('.slides');
let slides = document.querySelectorAll('.slide');
const slidesLength = slides.length;
let slider = [];
for (let i = 0; i < slidesLength; i++) {
  let clone = slides[i].cloneNode(true);
  slider[i] = clone;
  slides[i].remove();
}
const videos = document.getElementsByTagName('video');

let step = 0;
let activeSlide;
let prevSlide;
let nextSlide;

function draw() {
  activeSlide = document.createElement('span');
  activeSlide.classList.add('slide', 'slide_new');
  activeSlide.appendChild(slider[step]);
  activeSlide.style.left = 0 + 'px';

  prevSlide = document.createElement('span');
  prevSlide.classList.add('slide', 'slide_new');
  if (step === 0) {
    prevSlide.appendChild(slider[slider.length - 1]);
  } else {
    prevSlide.appendChild(slider[step - 1]);
  }
  prevSlide.style.left = -slideWidth + 'px';

  nextSlide = document.createElement('span');
  nextSlide.classList.add('slide', 'slide_new');
  if (step + 1 === slider.length) {
    nextSlide.appendChild(slider[0]);
  } else {
    nextSlide.appendChild(slider[step + 1]);
  }
  nextSlide.style.left = slideWidth + 'px';

  slideItems.prepend(activeSlide);
  slideItems.prepend(nextSlide);
  slideItems.append(prevSlide);
}

draw();

next.onclick = changeSlideNext;
prev.onclick = changeSlidePrev;

function changeSlideNext() {
  if (toggle_) {
    togglePlay();
    toggle_ = false;
  }
  next.onclick = null;
  step++;
  if (step === slidesLength) {
    step = 0;
  }
  body.style.backgroundColor = bgcolor[step];
  activeSlide.style.left = -slideWidth + 'px';
  nextSlide.style.left = 0 + 'px';
  prevSlide.style.left = -2 * slideWidth + 'px';

  videoPlay.currentTime = 0; //видео слайда с начала
  v_progress.value = 0;
  a_progress.value = 50; //громкость на середине
  a_progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${50}%, #fff ${50}%, white 100%)`;
  videoPlay.volume = 0.5;

  setTimeout(function () {
    if (step === 0 || step === 1) {
      //slider[step + slidesLength - 2].remove(); работают оба варианта, но второй видимо более правильный
      prevSlide.removeChild(slider[step + slidesLength - 2]);
    } else {
      //slider[step - 2].remove();
      prevSlide.removeChild(slider[step - 2]);
    }
    videos[1].classList.remove('video__play');
    videos[0].classList.add('video__play');
    videoPlay = document.querySelector('.video__play');
    videoPlay.addEventListener('click', togglePlay);
    videoPlay.addEventListener('timeupdate', videoProgress);
    draw();
    next.onclick = changeSlideNext;
  }, 300);
}

function changeSlidePrev() {
  if (toggle_) {
    togglePlay();
    toggle_ = false;
  }

  prev.onclick = null;
  if (step === 0) {
    step = slidesLength - 1;
  } else {
    step--;
  }
  body.style.backgroundColor = bgcolor[step];
  activeSlide.style.left = slideWidth + 'px';
  nextSlide.style.left = 2 * slideWidth + 'px';
  prevSlide.style.left = 0 + 'px';

  videoPlay.currentTime = 0; //видео слайда с начала
  v_progress.value = 0;
  a_progress.value = 50; //громкость на середине
  a_progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${50}%, #fff ${50}%, white 100%)`;
  videoPlay.volume = 0.5;

  setTimeout(function () {
    if (step === slidesLength - 1 || step === slidesLength - 2) {
      //slider[step - slidesLength + 2].remove();
      nextSlide.removeChild(slider[step - slidesLength + 2]);
    } else {
      //slider[step + 2].remove();
      nextSlide.removeChild(slider[step + 2]);
    }

    videos[0].classList.remove('video__play');
    videos[1].classList.add('video__play');
    videoPlay = document.querySelector('.video__play');
    videoPlay.addEventListener('click', togglePlay);
    draw();
    prev.onclick = changeSlidePrev;
  }, 300);
}

/**********************************/
/***********Плеер******************/
/**********************************/

let videoPlay = document.querySelector('.video__play');
const go = document.querySelector('.go');
const videoGo = document.querySelector('.video-go');
const videoIn = document.querySelectorAll('.video__in');
const v_progress = document.querySelector('.video-progress');
const a_progress = document.querySelector('.audio-progress');
const mySpeed = document.querySelector('.speed');
const start = document.querySelector('.start');
const finish = document.querySelector('.finish');
const myAudio = document.querySelector('.block2');
const audioImg = document.querySelector('.audio');
const myScreen = document.querySelector('.block3');
const btnBack = document.querySelector('.back');
const btnForward = document.querySelector('.forward');
let progress = 0;
let position;
let volume;
let audio_ = true;
let afterDrag = false;
let toggle_ = false;
let relation;

v_progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${0}%, #fff ${0}%, white 100%)`;
videoPlay.volume = 0.5;
a_progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${45}%, #fff ${45}%, white 100%)`;

go.addEventListener('click', togglePlay);
videoGo.addEventListener('click', togglePlay);
videoPlay.addEventListener('click', togglePlay);
videoPlay.addEventListener('timeupdate', videoProgress);
finish.addEventListener('click', toFinish);
start.addEventListener('click', toStart);
btnBack.addEventListener('click', toBack);
btnForward.addEventListener('click', toForward);

function changeAudio() {
  audioImg.classList.toggle('audio_non');
  if (a_progress.getAttribute("disabled")) {
    a_progress.removeAttribute("disabled");
    a_progress.value = volume * 100;
    a_progress.style.background = `linear-gradient(to right, #82CFD0
      0%, #82CFD0 ${volume*100}%, #fff ${volume*100}%, white 100%)`;
    videoPlay.volume = volume;
    audio_ = true;
  } else {
    volume = videoPlay.volume;
    a_progress.value = 0;
    a_progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${0}%, #fff ${0}%, white 100%)`;
    a_progress.setAttribute("disabled", 'disabled');
    videoPlay.volume = 0;
  }
}

function toBack() {
  relation = v_progress.value / videoPlay.currentTime;
  if (v_progress.value < 5 / relation) {
    toStart();
  } else {
    v_progress.value -= 5 / relation;
    videoPlay.currentTime -= 5;
  }
}

function toForward() {
  relation = v_progress.value / videoPlay.currentTime;
  if (v_progress.value >= 90 / relation) {
    toFinish();
  } else {
    v_progress.value += 10 / relation;
    videoPlay.currentTime += 10;
  }
}

function pause() { //ставим видео на паузу
  videoPlay.pause();
  go.classList.remove('pause');
  for (let item of videoIn) {
    item.classList.remove('hide');
  }
}

function unPause() { //снять с паузы
  videoPlay.play();
  go.classList.add('pause');
  for (let item of videoIn) {
    item.classList.add('hide');
  }
}

function toFinish() {
  videoPlay.currentTime = videoPlay.duration;
  v_progress.value = 100;
  pause();
  if (toggle_) {
    toggle_ = !toggle_;
  }
  afterDrag = false;
}

function toStart() {
  videoPlay.currentTime = 0;
  v_progress.value = 0;
  pause();
  if (toggle_) {
    toggle_ = !toggle_;
  }
  v_progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${0}%, #fff ${0}%, white 100%)`;
  afterDrag = false;
}

function togglePlay(e) {
  toggle_ = !toggle_; //для взаимодействия со слайдером
  const playState = videoPlay.paused ? 'play' : 'pause';
  videoPlay[playState](); // Call play or paused method 
  go.classList.toggle('pause');
  for (let item of videoIn) {
    item.classList.toggle('hide');
  }
  if (afterDrag) {
    videoPlay.currentTime = videoPlay.duration * position / 100;

    //console.log('videoPlay.currentTime', videoPlay.currentTime);
    //console.log('v_progress.value', v_progress.value);
  }
}

function videoProgress() { //Отображаем время воспроизведения
  progress = (Math.floor(videoPlay.currentTime) / (Math.floor(videoPlay.duration) / 100));
  v_progress.value = progress;
  v_progress.style.background = `linear-gradient(to right, #82CFD0 0%,
    #82CFD0 ${progress}%, #fff ${progress}%, white 100%)`;
}

myAudio.addEventListener('click', () => {
  changeAudio();
});

myScreen.addEventListener('click', () => {
  videoPlay.requestFullscreen();
});

v_progress.addEventListener('input', function () {
  videoPlay.removeEventListener('timeupdate', videoProgress);
  pause();
  const value = this.value;
  videoPlay.currentTime = value;
  this.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${value}%, #fff ${value}%, white 100%)`;
});

v_progress.addEventListener('change', () => {
  toggle_ = !toggle_; //для взаимодействия со слайдером
  videoPlay.addEventListener('timeupdate', videoProgress);
  position = v_progress.value;

  //console.log('position', position);
  afterDrag = true;
});

a_progress.addEventListener('input', function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${value}%, #fff ${value}%, white 100%)`;
  videoPlay.volume = this.value / 100;
});

mySpeed.addEventListener('input', function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${value}%, #fff ${value}%, white 100%)`;
  if (value <= 40) {
    videoPlay.playbackRate = 2 * value / 100;
  } else if (value > 40) {
    videoPlay.playbackRate = 6 * value / 100 - 2;
  }
});

function cancelFullscreen() {
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}

function videoPlayAdjust() {
  if (videoPlay.playbackRate <= 0.8) {
    mySpeed.value = videoPlay.playbackRate * 50;
  }
  if (videoPlay.playbackRate > 0.8) {
    mySpeed.value = (videoPlay.playbackRate + 2) * 100 / 6;
  }
  mySpeed.style.background = `linear-gradient(to right, #82CFD0 0%,
     #82CFD0 ${mySpeed.value}%, #fff ${mySpeed.value}%, white 100%)`;
}

function audioAdjust() {
  a_progress.value = videoPlay.volume * 100;
  a_progress.style.background = `linear-gradient(to right, #82CFD0
         0%, #82CFD0 ${videoPlay.volume*100}%, #fff ${videoPlay.volume*100}%, white 100%)`;
}

document.addEventListener('keydown', event => {
  if (event.code === 'KeyM') {
    if (audio_) {
      volume = videoPlay.volume;
    }
    audio_ = !audio_;
    changeAudio();
  }
  if (event.key === ' ') {
    event.preventDefault();
    togglePlay();
  }
  if (event.key === '0') {
    toStart();
  }

  if (event.code === 'KeyF') {
    videoPlay.requestFullscreen();
    if (document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled) {
      cancelFullscreen();
    } else {
      videoPlay.requestFullscreen();
    }
  }

  if (event.code === 'Period') {
    if (event.shiftKey) {
      if (videoPlay.playbackRate < 4) {
        videoPlay.playbackRate = videoPlay.playbackRate + 0.2;
      }
      videoPlayAdjust();
    }
  }
  if (event.code === 'Comma') {
    if (event.shiftKey) {
      if (videoPlay.playbackRate > 0.3) {
        videoPlay.playbackRate = videoPlay.playbackRate - 0.2;
      }
      videoPlayAdjust();
    }
  }

  if (event.code === 'ArrowUp') {
    if (videoPlay.volume < 0.9) {
      videoPlay.volume = videoPlay.volume * 1.1;
      audioAdjust();
    }
  }
  if (event.code === 'ArrowDown') {
    videoPlay.volume = videoPlay.volume / 1.1;
    audioAdjust();
  }
});