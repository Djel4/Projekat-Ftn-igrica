import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

// Prijem playerId-a od React aplikacije (:3000)
window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:3000') return;
    if (event.data && event.data.playerId) {
        localStorage.setItem('playerId', event.data.playerId);
        console.log('Primljen playerId od React-a:', event.data.playerId);
    }
});

// Zatraži playerId od prozora koji je otvorio igru
if (window.opener) {
    window.opener.postMessage({ type: 'REQUEST_PLAYER_ID' }, 'http://localhost:3000');
}
const DATA_KEYS = Object.freeze({
    ROTATION_SPEED: 'ROTATION_SPEED'

})

export class GameScene extends Phaser.Scene {
    #planet;
    #player;
    #playerAngleinRadians; //ovo je property koji ce mi sluziti za ugao kojim orbitira zemljom 
    #cursorKeys;
    #bulletGroup;
    #lastFiredBulletTime;
    #enemyGroup;
    #enemySpeed;
    #spawnDelay;
    #spawnTimer;
    #destroyedEnemyGroup;
    #score;
    #health;
    #lockInput;
    #scoreText;
    #planetHealthContainer;
    #waveText;
    #waveTextPrefiks;
    #timer;
    #currentWave;
    constructor(){
        super({
            key: SCENE_KEYS.GAME_SCENE,

        });

    }
    create() {
        const scaleX = this.scale.width / 640;
    const scaleY = this.scale.height / 360;
        this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_1, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_1).setAlpha(0.4);
         this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_2, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_2).setAlpha(0.4);
          this.add.sprite(0, 0, ASSET_KEYS.BACKGROUND_3, 0).setOrigin(0).setScale(scaleX, scaleY).play(ASSET_KEYS.BACKGROUND_3).setAlpha(0.4);

        this.#planet = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET, 0).play(ASSET_KEYS.PLANET);
        this.#planet.body.setCircle(30, 18, 18);
        this.#health = 3;
        this.#planetHealthContainer = this.add.container(this.scale.width / 2, this.#planet.y + 50, [
            this.add.sprite(-18, 0, ASSET_KEYS.HEART, 0).play(ASSET_KEYS.HEART),
            this.add.sprite(0, 0, ASSET_KEYS.HEART, 0).play(ASSET_KEYS.HEART),
            this.add.sprite(18, 0, ASSET_KEYS.HEART, 0).play(ASSET_KEYS.HEART),
        ]);

        this.#player = this.add.image(200, 200, ASSET_KEYS.SHIP);
        this.#playerAngleinRadians = 0;
        this.#updatePlayerPosition();

        this.#bulletGroup = this.physics.add.group([]);
        this.#lastFiredBulletTime = 0;

        this.#enemyGroup = this.physics.add.group([]);   
        this.#destroyedEnemyGroup = this.add.group([]);
        this.#spawnDelay = 1250;
        this.#enemySpeed = 80;    
        this.#spawnTimer = this.time.addEvent({
            delay: this.#spawnDelay,
            callback: this.#spawnEnemy,
            callbackScope: this,
            loop: true

        });//dozvoljava mi da dodajem timer event 

        this.time.addEvent({
            delay: 5000,
            callback: this.#increseDifficulty,
            callbackScope: this,
            loop: true

        });
        this.physics.add.overlap(this.#bulletGroup, this.#enemyGroup, this.#handleBulletAndEnemyCollision, undefined, this);
         this.physics.add.overlap(this.#planet, this.#enemyGroup, this.#handlePlanetAndEnemyCollision, undefined, this);
        this.#score = 0;

        const scoreTextPrefix = this.add.text(10, 10, 'SCORE: ', { fontSize: '16px'}).setDepth(2);
        this.#scoreText = this.add.text(scoreTextPrefix.x + scoreTextPrefix.displayWidth, scoreTextPrefix.y, '0', { fontSize: '16px'}).setDepth(2);
        
        const waveTextPrefiks = this.add.text(0, 10, 'TIMER: ', {fontSize: '16px'}).setDepth(2);
        this.#waveText = this.add.text(0, 10, '30', { fontSize: '16px'}).setDepth(2);
        const ukupnoSirineZaTimer = waveTextPrefiks.x + waveTextPrefiks.displayWidth + this.#waveText.displayHeight;
        waveTextPrefiks.setX(this.scale.width - ukupnoSirineZaTimer - 10);
        this.#waveText.setX(waveTextPrefiks.x + waveTextPrefiks.displayWidth);

        this.#currentWave = 1;
        this.#timer = 30;
        this.time.addEvent({
            delay: 1000,
            callback: this.#timeHandling,
            callbackScope: this,
            loop: true
        });

        this.#lockInput = false;
        this.#cursorKeys = this.input.keyboard.createCursorKeys();

         this.cameras.main.fadeIn(500);
    }

    update(time)
    {
        if (this.#lockInput == true)
        {
            return;
        }
        if (this.#cursorKeys.left.isDown){
        this.#playerAngleinRadians -= 0.06;
    }
     if (this.#cursorKeys.right.isDown){
        this.#playerAngleinRadians += 0.06;
    }
    
    this.#updatePlayerPosition();
    
    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space) && time > this.#lastFiredBulletTime + 200)
    {
        this.#fireBullet();
        this.#lastFiredBulletTime = time;
    }
    this.#bulletGroup.getChildren().forEach((bullet) => {
        if (bullet.active && (bullet.x < 0 || bullet.x > this.scale.width || bullet.y < 0 || bullet.y > this.scale.height))
        bullet.setActive(false).setVisible(false)

    }); 
      this.#enemyGroup.getChildren().forEach((enemy) => {
        if (enemy.active && (enemy.x < -50 || enemy.x > this.scale.width + 50 || enemy.y < -50 || enemy.y > this.scale.height + 50)){
        enemy.setActive(false).setVisible(false)
        return;
        }

        enemy.rotation += enemy.getData(DATA_KEYS.ROTATION_SPEED);
    });
    }
    //metoda koja ce da racuna poziciju 
    #updatePlayerPosition(){ //orijentisan je na sredinu kooja se dobila kada se podelilo sa 2
        const x = this.scale.width / 2 + (this.#planet.displayHeight / 2) * Math.cos(this.#playerAngleinRadians);
        const y = this.scale.height / 2 + (this.#planet.displayHeight / 2) * Math.sin(this.#playerAngleinRadians);
        this.#player.setPosition(x,y);
        this.#player.rotation = this.#playerAngleinRadians + Math.PI / 2; //rotiran da bi gledao od zemlje 
     }

     #fireBullet(){
        const x = this.#player.x;
        const y = this.#player.y;
        const velocity = this.physics.velocityFromRotation(this.#playerAngleinRadians, 400);
        const bullet = this.#bulletGroup.getFirstDead(true, x, y, ASSET_KEYS.BULLET, 0, true);//ova metoda mi omogucava da koristim ingame objekte koji su deo grupe a unisteni budu u igti 
        bullet.setActive(true).setVisible(true).setScale(1.5).play(ASSET_KEYS.BULLET).enableBody();
        bullet.setVelocity(velocity.x, velocity.y);
        bullet.setRotation(this.#player.rotation);
         this.sound.play(ASSET_KEYS.FX_SHOT, { 
       
        volume: 0.1,
        
    });
        console.log('fireBullet: number of bullet game objects in group - ', this.#bulletGroup.getChildren().length);
     }

     #spawnEnemy(){
        let x = 0;
        let y = 0;
        const edge = Phaser.Math.Between(0, 3);
        if (edge == 0)
        {
            x = 0;
            y = Phaser.Math.Between(0, this.scale.height);
        }
        else if (edge == 1){
            x= this.scale.width;
            y= Phaser.Math.Between(0, this.scale.height);

        }
         else if (edge == 2){
            x= Phaser.Math.Between(0, this.scale.width);
            y= 0;

        }
         else{
            x= Phaser.Math.Between(0, this.scale.width);
            y= this.scale.height;

        }
        
        const enemy = this.#enemyGroup.getFirstDead(true, x, y, ASSET_KEYS.ASTEROID, 0, true);
        enemy
            .setActive(true)
            .setVisible(true)
            .enableBody()
            .setScale(Phaser.Math.FloatBetween(0.75, 1.25))
            .setData(DATA_KEYS.ROTATION_SPEED, Phaser.Math.FloatBetween(-0.02, 0.02));

            this.physics.moveTo(enemy, this.scale.width / 2, this.scale.height / 2, this.#enemySpeed);
            enemy.body.setSize(enemy.displayWidth * 0.3, enemy.displayHeight *0.3)

            console.log('spawnEnemy: number of enemy game objects in group - ', this.#enemyGroup.getChildren().length);
        }  

     #increseDifficulty(){
        if(this.#spawnDelay  > 500){//limniti
        this.#spawnDelay -= 50;
        console.log('Spawn delay decresed to : ', this.#spawnDelay);
        this.#spawnTimer.destroy();
         this.#spawnTimer = this.time.addEvent({
            delay: this.#spawnDelay,
            callback: this.#spawnEnemy,
            callbackScope: this,
            loop: true
         });

        }
      
if (this.#enemySpeed < 200){//limiti

       this.#enemySpeed += 10;
        console.log('Enemy speed incresed to : ', this.#enemySpeed);
        }
     
     }
    #handleBulletAndEnemyCollision(bullet, enemy)
    {
     
        bullet.disableBody();
        bullet.setActive(false).setVisible(false);
        enemy.disableBody();
        enemy.setActive(false).setVisible(false);

        this.#score +=1;
        this.#scoreText.setText(this.#score.toString(10));

        this.#spawnDestroyedEnemy(enemy.x, enemy.y);
    }
    #spawnDestroyedEnemy(x, y)
    {
        const explosion = this.#destroyedEnemyGroup.getFirstDead(true, x, y, ASSET_KEYS.ASTEROID_EXPLODE, 0, true);
        explosion.setActive(true).setVisible(true).play(ASSET_KEYS.ASTEROID_EXPLODE);
        explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.setActive(false).setVisible(false);
        });
          this.sound.play(ASSET_KEYS.FX_EXPLOSION, { 
       
        volume: 0.5,
        
    });

    }
    #handlePlanetAndEnemyCollision(planet, enemy){
        enemy.disableBody();
        enemy.setActive(false).setVisible(false);
        this.#spawnDestroyedEnemy(enemy.x, enemy.y);
        this.#demagePlanet();
    }

    #demagePlanet()
    {
        if (this.#health <= 0)
        {   
            return;
        }

        this.#health -= 1;
        this.#planetHealthContainer.getAt(this.#health).destroy();

        this.cameras.main.shake(150, 0.02);
        this.tweens.add({
            targets: this.#planet,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 100,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            yoyo: true,
        });
          this.sound.play(ASSET_KEYS.FX_SHOT, { 
       
        volume: 0.1,
        
    });

        if (this.#health <= 0)
        {
           
            console.log('GAME OVER');
            this.#lockInput = true;
            this.#player.setVisible(false);
            this.#planet.disableBody();
            this.#planet.setActive(false).setVisible(false);
             this.#spawnDestroyedEnemy(this.#planet.x, this.#planet.y);
            
                this.cameras.main.fadeOut(500);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
                {
                    this.scene.start(SCENE_KEYS.GAME_OVER_SCENE, { score: this.#score});

                });
            
        }
      

    }
    #timeHandling()
    {
        if (this.#lockInput)return;
        this.#timer -=1;

        if (this.#timer <= 0) 
        {
            if (this.#currentWave === 5)
            {
                this.#handleGameWin();
                return;
            }
            this.#currentWave += 1;
            this.#timer = 30; 

            this.#newWaveText();

            if (this.#enemySpeed < 250) 
            {
                this.#enemySpeed += 30;
                console.log(`New wave: ${this.#currentWave}. Enemy speed: ${this.#enemySpeed}`);
            }
        }
        this.#waveText.setText(this.#timer.toString());
    }
    #newWaveText()
    {
        const newWaveText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, `WAVE ${this.#currentWave}`, 
        { 
        fontSize: '48px', 
        fontStyle: 'bold',
        fill: '#FFF',
        stroke: '#000000',
        strokeThickness: 6  
        }).setOrigin(0.5).setDepth(3).setScale(0);

        this.tweens.add(
        {
            targets:newWaveText,
            scale: 1,
            duration: 500,
            ease: Phaser.Math.Easing.Back.Out,
            yoyo: true,
            hold: 1500,
            onComplete: () =>{
                newWaveText.destroy();
            }
            
        });
    }
    #handleGameWin()
    {
        console.log("VICTORY");
        this.#lockInput = true;

        this.#enemyGroup.getChildren().forEach((enemy) => {
            if (enemy.active && enemy.body) enemy.body.setVelocity(0,0);
        });

        if(this.#spawnTimer) this.#spawnTimer.destroy();

        const winText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'VICTORY', 
        { fontSize: '48px',
            fontStyle: 'bold', 
            color: '#00ff00',
             stroke: '#000000',
             strokeThickness: 6
             }).setOrigin(0.5).setDepth(3);

             this.cameras.main.fadeOut(1000);
             this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>{
             this.scene.start(SCENE_KEYS.GAME_OVER_SCENE, { score: this.#score, isVictory : true});


             });
    }
}