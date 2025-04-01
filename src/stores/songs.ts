import { defineStore } from 'pinia';
import api from '../src/services/api';

export interface Song {
  id: number;
  title: string;
  artist: string;
  reactions_count: number;
  is_liked: boolean;
  album?: {
    cover: string;
  };
}

export const useSongStore = defineStore('song', {
  state: () => ({
    songs: [] as Song[],
    currentPage: 1,
    lastPage: 1,
  }),
  actions: {
    async fetchSongs(page = 1) {
      try {
        const { data } = await api.get(`/songs?page=${page}&limit=8`);
        this.songs = data.data || [];
        this.currentPage = data.meta.current_page || 1;
        this.lastPage = data.meta.last_page || 1;
      } catch (error) {
        console.error('Error fetching songs', error);
      }
    },
    async toggleSongLike(songId: number, isLiked: boolean) {
      try {
        if (isLiked) {
          await api.post(`/songs/${songId}/reactions/1`);
        } else {
          await api.delete(`/songs/${songId}/reactions`);
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },
  },
});
