
const backgroundVideo = document.createElement('video');

backgroundVideo.className = 'background-video';
backgroundVideo.src = 'videos/videoplayback.mp4';
backgroundVideo.autoplay = true;
backgroundVideo.muted = true;
backgroundVideo.loop = true;
backgroundVideo.playsInline = true;

backgroundVideo.setAttribute('aria-hidden', 'true');
backgroundVideo.setAttribute('tabindex', '-1');

document.body.prepend(backgroundVideo);
