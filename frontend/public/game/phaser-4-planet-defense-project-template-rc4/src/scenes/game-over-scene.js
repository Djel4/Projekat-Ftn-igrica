import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';


export class GameOverScene extends Phaser.Scene {
    #score;
  
     constructor(){
        super({
            key: SCENE_KEYS.GAME_OVER_SCENE,

        });
    }
    init(data)
    {
        this.#score = data.score; 
    }
    create() {

        window.addEventListener('message', (event) => {
         if (event.origin !== 'http://localhost:3000') return;
        if (event.data.playerId) {
        localStorage.setItem('playerId', event.data.playerId);
        }   
            });


        const scaleX = this.scale.width / 640;
        const scaleY = this.scale.height / 360; 
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_1, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_1).setAlpha(0.4);
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_2, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_2).setAlpha(0.4);
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_3, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_3).setAlpha(0.4);
        
        
        this.add.text(this.scale.width / 2, 350, 'GAME OVER', {
            fontSize: '32px'

        }).setOrigin(0.5);

         this.add.text(this.scale.width / 2, 650, 'CLICK TO PLAY AGAIN', {
            fontSize: '22px'

        }).setOrigin(0.5);
        
        const backButton = this.add.text(this.scale.width / 2, 60, 'BACK TO MENU', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
        window.close();
});
         this.add.text(this.scale.width / 2, 100, `SCORE: ${this.#score}`, {
            fontSize: '24px'

        }).setOrigin(0.5);


        this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
            
            this.cameras.main.fadeOut(500);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start(SCENE_KEYS.GAME_SCENE);

                });

        });
       this.#saveScore();
        this.cameras.main.fadeIn(500);
    }
        async #saveScore() {
    const playerId = localStorage.getItem('playerId');
    console.log('playerId:', playerId);
    console.log('score:', this.#score);
    if (!playerId) return;

    try {
        const response = await fetch('http://localhost:5001/api/notes/save-score', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: playerId, score: this.#score })
        });
        const data = await response.json();
        console.log('Score saved:', data);
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

    
    
}