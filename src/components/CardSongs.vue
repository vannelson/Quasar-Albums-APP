<template>
  <div>
    <!-- Songs List (Vertical Stack) -->
    <div class="song-list">
      <q-card v-for="(song, index) in paginatedSongs" :key="index" class="song-card">
        <!-- Rank (Top 1, Top 2, etc.) -->
        <div class="rank">
          <span>{{ 'Top ' + (index + 1) }}</span>
        </div>

        <!-- Song Image -->
        <q-img :src="song.image" class="song-image" />

        <!-- Song Info -->
        <q-card-section class="song-info">
          <div class="text-subtitle1 text-bold">{{ song.title }}</div>
          <div class="text-subtitle2 text-grey">{{ song.artist }}</div>
          <span class="text-grey like-count">{{ song.likeCount }} Likes</span>
        </q-card-section>

        <!-- Like Button -->
        <q-btn
          flat
          round
          :icon="song.liked ? 'star' : 'star_border'"
          class="like-btn"
          :color="song.liked ? 'yellow' : 'white'"
          @click="toggleLike(index)"
        />
      </q-card>
    </div>

    <!-- Pagination Controls -->
    <div v-if="paginationEnabled" class="pagination">
      <q-btn round dense flat icon="chevron_left" :disable="currentPage === 1" @click="prevPage" />
      <span class="page-indicator">Page {{ currentPage }} / {{ totalPages }}</span>
      <q-btn
        dense
        color="teal"
        icon="chevron_right"
        :disable="currentPage === totalPages"
        @click="nextPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Song {
  image: string;
  title: string;
  artist: string;
  likeCount: number;
  liked: boolean;
  // Add any other properties your song objects might have
}

const props = defineProps({
  songs: {
    type: Array as () => Song[],
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 8,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  paginationEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: 'updateCurrentPage', page: number): void;
  (e: 'toggleLike', songId: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.songs.length / props.itemsPerPage));

const paginatedSongs = computed<Song[]>(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  return props.songs.slice(start, start + props.itemsPerPage);
});

const toggleLike = (index: number) => {
  const song = paginatedSongs.value[index];
  if (song) {
    // Find the original index in the full songs array
    const originalIndex = props.songs.findIndex(
      (s) => s.title === song.title && s.artist === song.artist,
    );
    if (originalIndex !== -1) {
      emit('toggleLike', originalIndex);
    }
  }
};

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('updateCurrentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('updateCurrentPage', props.currentPage + 1);
  }
};
</script>

<style scoped>
.song-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 10px;
}

.song-card {
  width: calc(23.333% - 12px);
  background: transparent;
  color: white;
  border-radius: 8px;
  text-align: center;
  position: relative;
}

.song-image {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  object-fit: cover;
}

.rank {
  position: absolute;
  background: linear-gradient(45deg, #ff8c00, #ff2a68);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.song-info {
  padding: 10px 0;
}

.like-count {
  display: block;
  margin-top: 5px;
  font-size: 12px;
}

.like-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}

.page-indicator {
  margin: 0 10px;
}
</style>
