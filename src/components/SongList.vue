<template>
  <div>
    <q-toolbar class="justify-between">
      <div class="text-h5 text-bold">Trending Songs</div>

      <div>
        <q-btn
          icon="chevron_left"
          label="Previous"
          class="q-mr-md"
          :disable="isFirstPage"
          @click="prevPage"
        />
        <q-btn icon="chevron_right" label="Next" :disable="isLastPage" @click="nextPage" />
      </div>
    </q-toolbar>

    <div class="song-list">
      <q-card
        v-for="(song, index) in songStore.songs"
        :key="song.id"
        class="song-card relative-position"
        @dblclick="handleDoubleClick(song)"
      >
        <div class="song-bg-image" :style="backgroundImageStyle(index)"></div>

        <div class="song-content row no-wrap items-center">
          <div class="col">
            <div class="rank">Top {{ songRank(index) }}</div>
            <q-card-section class="song-info">
              <div class="text-subtitle1 text-bold">{{ song.title }}</div>
              <div class="text-subtitle2 text-grey">{{ song.artist }}</div>
              <span class="text-grey like-count">{{ song.reactions_count }} Star</span>
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
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSongStore } from '../stores/songs';

// Define event emission with `defineEmits`
const emit = defineEmits<{
  (event: 'song-double-clicked', song: Song): void;
}>();

const songStore = useSongStore();

const isFirstPage = computed(() => songStore.currentPage === 1);
const isLastPage = computed(() => songStore.currentPage === songStore.lastPage);

const prevPage = async () => {
  if (!isFirstPage.value) await songStore.fetchSongs(songStore.currentPage - 1);
};

const nextPage = async () => {
  if (!isLastPage.value) await songStore.fetchSongs(songStore.currentPage + 1);
};

const songRank = (index: number) => (songStore.currentPage - 1) * 8 + index + 1;

const backgroundImageStyle = (index: number) => ({
  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 40%), 
      url(https://picsum.photos/100/200${index})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '30%',
  height: '100%',
});

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

// Handle the double-click event and emit it to the parent component
const handleDoubleClick = (song: Song) => {
  emit('song-double-clicked', song);
};

onMounted(async () => {
  await songStore.fetchSongs();
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
  width: 350px;
  height: 100px;
  overflow: hidden;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
}

.song-bg-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 30%;
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

.song-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
}
</style>
