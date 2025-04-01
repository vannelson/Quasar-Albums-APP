<template>
  <q-page padding class="bg-dark text-white">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-9">
        <SongList
          :songs="songStore.songs"
          :current-page="songStore.currentPage"
          :last-page="songStore.lastPage"
          @prev-page="prevPage"
          @next-page="nextPage"
          @toggle-like="toggleLike"
        />
      </div>
      <div class="col-12 col-md-3">
        <AudioPlayer />
      </div>
      <div class="col-12 col-md-12">
        <q-card class="q-pa-md bg-dark text-white full-white">
          <q-card-section>
            <div class="text-h6 text-bold">Online Users</div>
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <div class="row no-wrap">
              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=alice" />
                </q-avatar>
                <span class="user-name">Alice</span>
                <q-badge class="emotion-badge">😊</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=bob" />
                </q-avatar>
                <span class="user-name">Bob</span>
                <q-badge class="emotion-badge">😂</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=charlie" />
                </q-avatar>
                <span class="user-name">Charlie</span>
                <q-badge class="emotion-badge">😎</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=david" />
                </q-avatar>
                <span class="user-name">David</span>
                <q-badge class="emotion-badge">😍</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=emma" />
                </q-avatar>
                <span class="user-name">Emma</span>
                <q-badge class="emotion-badge">😢</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=frank" />
                </q-avatar>
                <span class="user-name">Frank</span>
                <q-badge class="emotion-badge">🤔</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=grace" />
                </q-avatar>
                <span class="user-name">Grace</span>
                <q-badge class="emotion-badge">🥳</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=henry" />
                </q-avatar>
                <span class="user-name">Henry</span>
                <q-badge class="emotion-badge">😡</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=ivy" />
                </q-avatar>
                <span class="user-name">Ivy</span>
                <q-badge class="emotion-badge">😴</q-badge>
              </q-chip>

              <q-chip square clickable class="user-chip q-mr-sm">
                <q-avatar>
                  <img src="https://i.pravatar.cc/40?u=jack" />
                </q-avatar>
                <span class="user-name">Jack</span>
                <q-badge class="emotion-badge">😆</q-badge>
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
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
