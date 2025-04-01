<template>
  <q-page padding class="bg-dark text-white">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <AlbumList
          :songs="albumStore.albums"
          :current-page="albumStore.currentPage"
          :last-page="albumStore.lastPage"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAlbumStore } from '../stores/albums';
import AlbumList from '../components/AlbumList.vue';

const albumStore = useAlbumStore();

const prevPage = async () => {
  if (albumStore.currentPage > 1) {
    await albumStore.fetchAlbums(albumStore.currentPage - 1);
  }
};

const nextPage = async () => {
  if (albumStore.currentPage < albumStore.lastPage) {
    await albumStore.fetchAlbums(albumStore.currentPage + 1);
  }
};

// Fetch initial data
onMounted(async () => {
  await albumStore.fetchAlbums();
});
</script>
