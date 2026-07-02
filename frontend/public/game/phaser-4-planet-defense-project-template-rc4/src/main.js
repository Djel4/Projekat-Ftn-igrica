import Phaser from './lib/phaser.js';
import { GameScene } from './scenes/game-scene.js';    
import { PreloadScene } from './scenes/preload-scene.js'; 
import { SCENE_KEYS } from './common/scene-keys.js';
import { GameOverScene } from './scenes/game-over-scene.js';
import { TitleScene } from './scenes/title-scene.js';  

window.addEventListener('message', async (event) => {
    if (event.origin !== 'http://localhost:3000') return;
    if (event.data && event.data.playerId) {
        localStorage.setItem('playerId', event.data.playerId);
        try {
            const res = await fetch(`http://localhost:5001/api/notes/${event.data.playerId}`);
            const player = await res.json();
            window.PLAYER_SKIN = player.currentSkin || 'defaultSkin';
            console.log('Aktivan skin:', window.PLAYER_SKIN);
        } catch (err) {
            window.PLAYER_SKIN = 'defaultSkin';
        }
    }
});

if (window.opener) {
    window.opener.postMessage({ type: 'REQUEST_PLAYER_ID' }, 'http://localhost:3000');
}
const gameConfig = {
    type: Phaser.CANVAS, 
    pixelArt: true,
    roundPixels: true,
    scale: {
    parent: 'game-container', 
    width: 1000,
    height: 720,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    },
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, X:0 }, 
            debug: true       
        },
    },
};


const game = new Phaser.Game(gameConfig);
game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);
game.scene.add(SCENE_KEYS.GAME_OVER_SCENE, GameOverScene);
game.scene.add(SCENE_KEYS.TITLE_SCENE, TitleScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);

console.log('Phaser igra je pokrenuta!');