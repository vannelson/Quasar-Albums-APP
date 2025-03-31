<template>
  <q-card class="audio-card">
    <!-- Background image for the now playing section -->
    <div
      class="now-playing-bg"
      :style="{ backgroundImage: `url(https://picsum.photos/300/200?random=${Math.random()})` }"
    >
      <div class="overlay">
        <div class="text-h6">{{ currentSong.title }}</div>
        <div class="text-subtitle2">Votes: {{ currentSong.votes }}</div>
      </div>
    </div>

    <q-card-section class="q-pa-md">
      <audio ref="audioPlayer" controls class="audio-player">
        <source :src="currentSong.url" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </q-card-section>

    <q-card-section class="q-pa-md row justify-around">
      <q-btn icon="stop" color="red" size="lg" round @click="stopAudio" />
      <q-btn icon="skip_next" color="green" size="lg" round @click="nextAudio" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentSong = ref({
  title: 'Song Title Here',
  votes: 120,
  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
});

const audioPlayer = ref<HTMLAudioElement | null>(null);

const stopAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
  }
};

const nextAudio = async () => {
  if (audioPlayer.value) {
    try {
      await audioPlayer.value.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
};
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

.audio-player {
  width: 100%;
}
</style>
