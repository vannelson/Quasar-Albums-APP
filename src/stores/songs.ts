import { defineStore } from 'pinia';
import api from '../src/services/api';

export interface Song {
  id: number;
  title: string;
  artist: string;
  reactions_count: number;
  is_liked: boolean;
  url?: string;
  album?: {
    cover: string;
  };
}

export interface SongReactionUpdate {
  song_id: number;
  reactions_count: number;
}

export const useSongStore = defineStore('song', {
  state: () => ({
    songs: [] as Song[],
    currentPage: 1,
    lastPage: 1,
    playingSong: null as Song | null,
  }),
  actions: {
    async fetchSongs(page = 1) {
      try {
        const { data } = await api.get(`/songs?page=${page}&limit=8`);
        this.songs = data.data || [];
        this.currentPage = data.meta.current_page || 1;
        this.lastPage = data.meta.last_page || 1;
        this.playingSong = data.data.at(0);
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
    updateSongReaction(updatedReaction: SongReactionUpdate) {
      const songIndex = this.songs.findIndex((song) => song.id === updatedReaction.song_id);
      if (songIndex !== -1) {
        if (songIndex !== -1 && this.songs[songIndex]) {
          this.songs[songIndex].reactions_count = updatedReaction.reactions_count;
        }
      }
    },
    setPlayingSong(song: Song) {
      this.playingSong = song;
    },
    async createSong(payload: {
      album_id: number;
      title: string;
      artist: string;
      duration: string;
      url: string;
    }) {
      try {
        const { data } = await api.post('/songs', payload);
        this.songs.unshift(data);
        return data;
      } catch (error) {
        console.error('Error creating song:', error);
        throw error;
      }
    },
  },
});
