<template>
  <q-page padding class="bg-dark text-white">
    <div class="row">
      <div class="col-9">
        <q-toolbar class="justify-end">
          <q-btn
            icon="chevron_left"
            label="Previous"
            class="q-mr-md"
            :disable="songStore.currentPage === 1"
            @click="prevPage"
          />
          <q-btn
            icon="chevron_right"
            label="Next"
            :disable="songStore.currentPage === songStore.lastPage"
            @click="nextPage"
          />
        </q-toolbar>

        <div class="song-list">
          <q-card
            v-for="(song, index) in songStore.songs"
            :key="song.id"
            class="song-card relative-position"
          >
            <div
              class="song-bg-image absolute"
              :style="{
                'background-image': `linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 40%), 
                url(https://picsum.photos/100/200${index})`,
                'background-size': 'cover',
                'background-position': 'center',
                width: '30%',
                height: '100%',
              }"
            ></div>

            <div class="song-content row no-wrap items-center">
              <div class="col">
                <div class="rank">
                  <span>Top {{ (songStore.currentPage - 1) * 8 + index + 1 }}</span>
                </div>
                <q-card-section class="song-info">
                  <div class="text-subtitle1 text-bold">{{ song.title }}</div>
                  <div class="text-subtitle2 text-grey">{{ song.artist }}</div>
                  <span class="text-grey like-count">{{ song.reactions_count }} Likes</span>
                </q-card-section>
              </div>
              <q-btn
                flat
                round
                :icon="song.is_liked ? 'star' : 'star_border'"
                class="like-btn"
                color="yellow"
                @click="toggleLike(song)"
              />
            </div>
          </q-card>
        </div>
      </div>

      <div class="col-3">
        <AudioPlayer />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSongStore } from '../stores/songs';
import AudioPlayer from '../components/AudioPlayer.vue';

const songStore = useSongStore();
const isLoading = ref(true);
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
type Song = {
  id: number;
  title: string;
  artist: string;
  reactions_count: number;
  is_liked: boolean;
};

const toggleLike = async (song: Song) => {
  const songIndex = songStore.songs.findIndex((s) => s.id === song.id);
  if (songIndex !== -1) {
    const newLikedStatus = !song.is_liked;
    songStore.songs[songIndex] = {
      ...song,
      is_liked: newLikedStatus,
      reactions_count: song.reactions_count + (newLikedStatus ? 1 : -1),
    };
    await songStore.toggleSongLike(song.id, newLikedStatus);
  }
};

onMounted(async () => {
  isLoading.value = true;
  await songStore.fetchSongs();
  isLoading.value = false;
});
</script>

<style scoped>
.song-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  justify-content: center;
}

.song-card {
  flex: 0 0 auto;
  width: 350px;
  height: 100px;
  overflow: hidden;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
}

.audio-card {
  background: rgba(20, 20, 20, 0.9);
  border-radius: 8px;
  padding: 16px;
}

.audio-player {
  width: 100%;
}

.song-bg-image {
  width: 3%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px 0 0 8px;
}

.song-content {
  height: 80%;
  padding-left: 30%;
  position: relative;
  z-index: 1;
}

.song-info {
  padding: 8px 16px;
}

.rank {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(220, 139, 73, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.like-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

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
</style>
