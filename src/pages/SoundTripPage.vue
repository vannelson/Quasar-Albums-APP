<template>
  <q-page padding class="bg-dark text-white">
    <div class="row">
      <div class="col-9">
        <SongList
          :songs="songStore.songs"
          :current-page="songStore.currentPage"
          :last-page="songStore.lastPage"
          @prev-page="prevPage"
          @next-page="nextPage"
          @toggle-like="toggleLike"
        />
      </div>

      <div class="col-3">
        <AudioPlayer />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSongStore } from '../stores/songs';
import SongList from '../components/SongList.vue';
import AudioPlayer from '../components/AudioPlayer.vue';

const songStore = useSongStore();

const prevPage = async () => {
  if (songStore.currentPage > 1) {
    await songStore.fetchSongs(songStore.currentPage - 1);
  }
};

const nextPage = async () => {
  if (songStore.currentPage < songStore.lastPage) {
    await songStore.fetchSongs(songStore.currentPage + 1);
  }
};

const toggleLike = async (songId: number, isLiked: boolean) => {
  await songStore.toggleSongLike(songId, isLiked);
};

// Fetch initial data
onMounted(async () => {
  await songStore.fetchSongs();
});
</script>
