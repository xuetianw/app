
export class SongController {
    // Attributes
    songs = [];

    // Methods
    constructor() {
        this.songs = JSON.parse(localStorage.songsArray || '[]');
    }

    addSong(song) {
        this.songs.push(song);
        localStorage.songsArray = JSON.stringify(this.songs);
    }

    getAllSongs() {
        return JSON.parse(localStorage.songsArray);
    }
}