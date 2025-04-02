<template>
  <div class="form-wrapper">
    <div class="form-header">
      <div class="header-overlay">
        <h2>Song Registration</h2>
      </div>
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md form-container">
      <q-select
        filled
        v-model="selectedAlbum"
        :options="albumStore.albums"
        label="Select Album *"
        option-label="title"
        option-value="id"
        emit-value
        map-options
        lazy-rules
        :rules="[(val) => !!val || 'Album selection is required']"
      >
        <template v-slot:prepend>
          <q-icon name="album" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No albums available </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input filled v-model="title" label="Song Title *" counter maxlength="50" lazy-rules>
        <template v-slot:prepend>
          <q-icon name="music_note" />
        </template>
        <template v-slot:append>
          <q-icon v-if="title" name="close" @click="title = ''" class="cursor-pointer" />
        </template>
        <template v-slot:hint> Enter the full song title </template>
      </q-input>

      <q-input filled v-model="artist" label="Artist *" counter maxlength="30" lazy-rules>
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
        <template v-slot:append>
          <q-icon v-if="artist" name="close" @click="artist = ''" class="cursor-pointer" />
          <q-icon name="search" @click="searchArtist" />
        </template>
        <template v-slot:hint> Primary artist name </template>
      </q-input>

      <q-input
        filled
        v-model="youtubeUrl"
        label="YouTube URL (Optional)"
        hint="Paste YouTube link"
        @paste="handlePaste"
      >
        <template v-slot:prepend>
          <q-icon name="link" />
        </template>
      </q-input>

      <div class="form-actions">
        <q-btn
          label="Register Song"
          type="submit"
          color="primary"
          class="full-width"
          :loading="isLoading"
          icon="add"
          size="lg"
        />
      </div>

      <div class="form-note">
        <q-icon name="info" size="sm" />
        <span>Required fields are marked with *. YouTube ID will be extracted automatically.</span>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAlbumStore } from '../stores/albums';
import { useSongStore } from '../stores/songs';
import { useQuasar } from 'quasar';

const albumStore = useAlbumStore();
const songStore = useSongStore();
const $q = useQuasar();

const selectedAlbum = ref<number | null>(null);
const title = ref<string>('');
const artist = ref<string>('');
const youtubeUrl = ref<string>('');
const youtubeId = ref<string>('');
const duration = ref<string>('0');
const isLoading = ref<boolean>(false);

const handlePaste = async (event: ClipboardEvent): Promise<void> => {
  const pastedText = event.clipboardData?.getData('text') || '';
  youtubeUrl.value = pastedText;
  extractVideoId();

  if (youtubeId.value) {
    try {
      isLoading.value = true;
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId.value}&format=json`,
      );

      if (!response.ok) throw new Error('Failed to fetch video info');
      const data = await response.json();
      const titleParts = data.title.split(/[-–:|]/);

      if (titleParts.length >= 2) {
        artist.value = titleParts[0].trim();
        title.value = titleParts[1].trim();
      } else {
        title.value = data.title;
      }
    } catch (error) {
      console.error('Error fetching video info:', error);
      $q.notify({ type: 'warning', message: 'Could not fetch video details', position: 'top' });
    } finally {
      isLoading.value = false;
    }
  }
};

const extractVideoId = (): void => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = youtubeUrl.value.match(regExp);
  youtubeId.value = match?.[2]?.length === 11 ? match[2] : '';

  if (!youtubeId.value && youtubeUrl.value) {
    $q.notify({ type: 'warning', message: 'Invalid YouTube URL format', position: 'top' });
  }
};

const onSubmit = async (): Promise<void> => {
  try {
    isLoading.value = true;
    if (!selectedAlbum.value || !title.value || !artist.value)
      throw new Error('Please fill all required fields');

    const payload = {
      album_id: selectedAlbum.value,
      title: title.value,
      artist: artist.value,
      duration: duration.value,
      url: youtubeId.value || '',
    };
    await songStore.createSong(payload);
    $q.notify({ type: 'positive', message: 'Song created successfully!', position: 'top' });
    resetForm();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error instanceof Error ? error.message : 'Failed to create song',
      position: 'top',
    });
  } finally {
    isLoading.value = false;
  }
};

const resetForm = (): void => {
  selectedAlbum.value = null;
  title.value = '';
  artist.value = '';
  youtubeUrl.value = '';
  youtubeId.value = '';
  duration.value = '0';
};

const searchArtist = (): void => {
  alert('Artist search would open here');
};

onMounted(() => {
  albumStore.fetchAlbums().catch((error) => {
    console.error('Error fetching albums:', error);
    $q.notify({ type: 'negative', message: 'Failed to load albums', position: 'top' });
  });
});
</script>

<style scoped>
.form-wrapper {
  max-width: 500px;
  margin: 20px auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.form-header {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  height: 120px;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  color: white;
}

.header-overlay h2 {
  font-size: 28px;
  font-weight: 600;
}

.form-container {
  background-color: white;
  padding: 25px;
}
</style>
