import { defineStore } from 'pinia';
import api from '../src/services/api';

export interface Album {
  id: number;
  title: string;
  description: string;
}

export const useAlbumStore = defineStore('album', {
  state: () => ({
    albums: [] as Album[],
    currentPage: 1,
    lastPage: 1,
  }),
  actions: {
    async fetchAlbums(page = 1) {
      try {
        const { data } = await api.get(`/albums?page=${page}&limit=5`);
        this.albums = data.data || [];
        this.currentPage = data.meta.current_page || 1;
        this.lastPage = data.meta.last_page || 1;
      } catch (error) {
        console.error('Error fetching albums', error);
      }
    },
  },
});
