<template>
  <q-card class="audio-card">
    <q-card-section class="q-pa-md">
      <div class="video-container">
        <div id="youtube-player"></div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <div class="song-info">
        <q-badge color="blue" rounded class="q-mb-sm">Now Playing</q-badge>
        <div class="text-h6">{{ currentSong?.title || 'No song selected' }}</div>
        <div class="text-subtitle2">{{ currentSong?.artist }}</div>
        <div class="reaction-container">
          <q-icon name="star" color="yellow" size="sm" />
          <span class="text-body2 q-ml-xs">{{ currentSong?.reactions_count || 0 }} Likes</span>
        </div>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useSongStore } from '../stores/songs';
import type { YTPlayer, YTPlayerEvent } from '../types/youtube';

const songStore = useSongStore();
const isPlaying = ref(false);
const isPlayerReady = ref(false);
const currentSong = computed(() => songStore.playingSong);
let player: YTPlayer | null = null;

const loadYouTubePlayer = () => {
  if (window.YT?.Player) {
    createPlayer();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = createPlayer;
    document.head.appendChild(tag);
  }
};

const createPlayer = () => {
  player = new window.YT.Player('youtube-player', {
    height: '200',
    width: '100%',
    videoId: currentSong.value?.url || '',
    playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0 },
    events: {
      onReady: (event: YTPlayerEvent) => {
        player = event.target;
        isPlayerReady.value = true;
        if (currentSong.value?.url) {
          event.target.playVideo();
          isPlaying.value = true;
        }
      },
      onStateChange: (event: YTPlayerEvent) => {
        isPlaying.value = event.data === window.YT.PlayerState.PLAYING;
      },
    },
  });
};

const togglePlayPause = () => {
  if (!player || !isPlayerReady.value) return;
  if (isPlaying.value) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
};

const stopVideo = () => {
  if (!player || !isPlayerReady.value) return;
  player.stopVideo();
  isPlaying.value = false;
};

const nextVideo = () => {
  if (!songStore.songs.length || !player || !isPlayerReady.value) return;
  const currentIndex = songStore.songs.findIndex((song) => song.id === currentSong.value?.id);
  const nextSong = songStore.songs[(currentIndex + 1) % songStore.songs.length];
  if (nextSong?.url) {
    songStore.setPlayingSong(nextSong);
    player.loadVideoById(nextSong.url);
    isPlaying.value = true;
  }
};

const handleSongChange = (newSong: typeof currentSong.value) => {
  if (!isPlayerReady.value || !player) return;
  if (newSong?.url) {
    player.loadVideoById(newSong.url);
    isPlaying.value = true;
  } else {
    player.stopVideo();
    isPlaying.value = false;
  }
};

watch(() => songStore.playingSong, handleSongChange, { immediate: true });

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
.video-container {
  width: 100%;
  height: 200px;
}
.song-info {
  text-align: center;
  color: white;
}
.reaction-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  color: #fff;
}
</style>
