<template>
  <q-card class="audio-card">
    <q-card-section class="q-pa-md">
      <div class="video-container">
        <div id="youtube-player"></div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md row justify-around">
      <q-btn
        :icon="isPlaying ? 'pause' : 'play_arrow'"
        color="blue"
        size="lg"
        round
        @click="togglePlayPause"
      />
      <q-btn icon="stop" color="red" size="lg" round @click="stopVideo" />
      <q-btn icon="skip_next" color="purple" size="lg" round @click="nextVideo" />
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSongStore } from '../stores/songs';
import type { YTPlayer, YTPlayerEvent, YTPlayerOptions } from '../types/youtube';

const songStore = useSongStore();
const currentIndex = ref(0);
const currentSong = computed(() => songStore.songs[currentIndex.value] || null);
const isPlaying = ref(false);

let player: YTPlayer | null = null;

const loadYouTubePlayer = () => {
  if (window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = createPlayer;
    document.head.appendChild(tag);
  }
};

onMounted(async () => {
  await songStore.fetchSongs();
  loadYouTubePlayer();

  songStore.songs.forEach((song) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${song.url}`;
    console.log(youtubeUrl, `(${song.title} - ${song.artist})`);
  });
});

// Create YouTube Player
const createPlayer = () => {
  if (!currentSong.value?.url) return;
  console.log(currentSong);
  const options: YTPlayerOptions = {
    height: '200',
    width: '100%',
    videoId: currentSong.value.url,
    playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0 },
    events: {
      onReady: (event: YTPlayerEvent) => {
        event.target.playVideo();
        isPlaying.value = true;
      },
      onStateChange: (event: YTPlayerEvent) => {
        isPlaying.value = event.data === window.YT.PlayerState.PLAYING;
      },
    },
  };

  player = new window.YT.Player('youtube-player', options);
};

const togglePlayPause = () => {
  if (!player) return;

  if (isPlaying.value) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }

  isPlaying.value = !isPlaying.value;
};

const stopVideo = () => {
  player?.stopVideo();
  isPlaying.value = false;
};

const nextVideo = () => {
  if (songStore.songs.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % songStore.songs.length;
  player?.loadVideoById(currentSong.value?.url || '');
  isPlaying.value = true;
};

onMounted(async () => {
  await songStore.fetchSongs();
  loadYouTubePlayer();
});
</script>

<style scoped>
.audio-card {
  background: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  overflow: hidden;
}

.now-playing-bg {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 10px;
}

.video-container {
  width: 100%;
  height: 200px;
}
</style>
