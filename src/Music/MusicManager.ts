import * as ex from 'excalibur';
import { Resources } from '../resources';


export class MusicManager {

    private static currentMusic: ex.Sound | null = null;
    private static volume: number = 0.5;

    public static play(music: ex.Sound): void {

        //If the music is already playing, we don't need to do anything
        if (this.currentMusic === music) {
            return;
        }

        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        this.currentMusic = music;

        music.loop = true;

        music.play(this.volume);
    }

    public static stop(): void {

        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    public static setVolume(volume: number): void {

        // Prevent having a volume lower than 0 or higher than 1.
        this.volume = Math.max(0, Math.min(1, volume));

        if (this.currentMusic) {
            this.currentMusic.volume = this.volume;
        }
    }

    public static getVolume(): number {
        return this.volume;
    }
    
    public static isPlaying(): boolean {

        return this.currentMusic !== null;
    }
}