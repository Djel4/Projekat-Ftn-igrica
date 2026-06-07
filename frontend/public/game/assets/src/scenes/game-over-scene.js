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
        const scaleX = this.sys.game.config.width / 640;
        const scaleY = this.sys.game.config.height / 360;
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_1, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_1).setAlpha(0.4);
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_2, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_2).setAlpha(0.4);
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_3, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_3).setAlpha(0.4);

        this.add.text(this.scale.width / 2, 350, 'GAME OVER', {
            fontSize: '32px'

        }).setOrigin(0.5);

         this.add.text(this.scale.width / 2, 650, 'CLICK TO PLAY AGAIN', {
            fontSize: '22px'

        }).setOrigin(0.5);

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
        this.cameras.main.fadeIn(500);
    }
}