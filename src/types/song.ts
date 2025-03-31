export interface Album {
  cover: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  reactions_count: number;
  is_liked: boolean;
  album?: Album;
}
