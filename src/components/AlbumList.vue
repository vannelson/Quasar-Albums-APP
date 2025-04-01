<template>
  <div>
    <q-toolbar class="justify-between q-mb-md">
      <div class="text-h5 text-bold">Trending Albums</div>
      <div>
        <q-btn
          icon="chevron_left"
          label="Previous"
          class="q-mr-md"
          :disable="isFirstPage"
          @click="prevPage"
          unelevated
          rounded
          color="primary"
        />
        <q-btn
          icon="chevron_right"
          label="Next"
          :disable="isLastPage"
          @click="nextPage"
          unelevated
          rounded
          color="primary"
        />
      </div>
    </q-toolbar>

    <div class="album-list">
      <q-card v-for="album in typedAlbums" :key="album.id" class="album-card relative-position">
        <!-- Album Header Section -->
        <div
          class="album-header"
          :style="{ backgroundImage: `url(https://picsum.photos/600/400?random=${album.id})` }"
        >
          <div class="album-overlay"></div>
          <div class="album-details">
            <q-img
              :src="`https://picsum.photos/200/200?random=${album.id}`"
              class="album-thumbnail"
            />
            <div>
              <div class="album-title">{{ album.title }}</div>
              <div class="album-artist">Artist Name</div>
              <div class="album-meta">{{ album.songs?.length ?? 0 }} songs</div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="album-controls">
          <q-btn round unelevated color="green" icon="play_arrow" size="lg" />
          <q-btn round unelevated icon="add" size="md" class="q-ml-sm" />
          <q-btn round unelevated icon="more_vert" size="md" class="q-ml-sm" />
        </div>

        <!-- Song List -->
        <q-list separator class="songs-list">
          <q-item clickable v-for="(song, index) in album.songs?.slice(0, 3) ?? []" :key="song.id">
            <q-item-section avatar>
              {{ index + 1 }}
            </q-item-section>
            <q-item-section>
              <!-- Randomly add star icon to some songs -->
              <q-item-label class="text-bold text-white">
                <q-icon v-if="Math.random() > 0.5" name="star" class="q-mr-sm" color="yellow" />
                {{ song.title }}
              </q-item-label>
              <q-item-label caption class="text-white">{{
                formatDuration(song.duration)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAlbumStore } from '../stores/albums';

interface Song {
  id: number;
  album_id: number;
  title: string;
  duration: number;
}

interface Album {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  songs?: Song[]; // <-- Make it optional
}

const albumStore = useAlbumStore();
const typedAlbums = computed(() => albumStore.albums as Album[]);
const isFirstPage = computed(() => albumStore.currentPage === 1);
const isLastPage = computed(() => albumStore.currentPage === albumStore.lastPage);

const prevPage = async () => {
  if (!isFirstPage.value) await albumStore.fetchAlbums(albumStore.currentPage - 1);
};

const nextPage = async () => {
  if (!isLastPage.value) await albumStore.fetchAlbums(albumStore.currentPage + 1);
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

onMounted(async () => {
  await albumStore.fetchAlbums();
  console.log(albumStore.albums);
});
</script>

<style scoped>
.album-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  justify-content: center;
}

.album-card {
  overflow: hidden;
  background: #181818;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  padding-bottom: 12px;
}

.album-header {
  height: 250px;
  width: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.album-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}

.album-details {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.album-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.album-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.album-artist {
  font-size: 1rem;
  color: #b3b3b3;
}

.album-meta {
  font-size: 0.9rem;
  color: #b3b3b3;
}

.album-controls {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.songs-list {
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
}
</style>
