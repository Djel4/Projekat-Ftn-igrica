export const ASSET_KEYS = {
  BACKGROUND_1: 'BACKGROUND_1',
  BACKGROUND_2: 'BACKGROUND_2',
  BACKGROUND_3: 'BACKGROUND_3',
  PLANET: 'PLANET',
  ASTEROID_EXPLODE: 'ASTEROID_EXPLODE',
  BULLET: 'BULLET',
  HEART: 'HEART',
  ASTEROID: 'ASTEROID',
  SHIP: 'SHIP',
  BACKGROUND_MUSIC: 'BACKGROUND_MUSIC',
  FX_HIT: 'FX_HIT',
  FX_SHOT: 'FX_SHOT',
  FX_EXPLOSION: 'FX_EXPLOSION',
};

// novi skinovi planeta
export const PLANET_SKINS = [
  { key: 'brownie',        asset: 'PLANET_BROWNIE',        path: 'assets/images/skins/brownie.png' },
  { key: 'coal',           asset: 'PLANET_COAL',           path: 'assets/images/skins/coal.png' },
  { key: 'coktel',         asset: 'PLANET_COKTEL',         path: 'assets/images/skins/coktel.png' },
  { key: 'cookielight',    asset: 'PLANET_COOKIELIGHT',    path: 'assets/images/skins/cookieLigth.png' },
  { key: 'corrupted',      asset: 'PLANET_CORRUPTED',      path: 'assets/images/skins/corrupted.png' },
  { key: 'crainginvasion', asset: 'PLANET_CRAINGINVASION', path: 'assets/images/skins/craingInvasion.png' },
  { key: 'darkcookie',     asset: 'PLANET_DARKCOOKIE',     path: 'assets/images/skins/darkcookie.png' },
  { key: 'fakeearth',      asset: 'PLANET_FAKEEARTH',      path: 'assets/images/skins/fakeEarth.png' },
  { key: 'fishy',          asset: 'PLANET_FISHY',          path: 'assets/images/skins/fishy.png' },
  { key: 'ice',            asset: 'PLANET_ICE',            path: 'assets/images/skins/ice.png' },
  { key: 'lime',           asset: 'PLANET_LIME',           path: 'assets/images/skins/lime.png' },
  { key: 'purple',         asset: 'PLANET_PURPLE',         path: 'assets/images/skins/purple.png' },
  { key: 'snow',           asset: 'PLANET_SNOW',           path: 'assets/images/skins/snow.png' },
  { key: 'snowstorm',      asset: 'PLANET_SNOWSTORM',      path: 'assets/images/skins/snowStorm.png' },
  { key: 'void',           asset: 'PLANET_VOID',           path: 'assets/images/skins/void.png' },
];
export const SPRITESHEET_ASSETS = [
  {
    assetKey: ASSET_KEYS.BACKGROUND_1,
    frameWidth: 640,
    frameHeight: 360,
    path: 'assets/images/foozle/background_1.png',
    frameRate: 8,
    repeat: -1,
  },
  {
    assetKey: ASSET_KEYS.BACKGROUND_2,
    frameWidth: 640,
    frameHeight: 360,
    path: 'assets/images/foozle/background_2.png',
    frameRate: 8,
    repeat: -1,
  },
  {
    assetKey: ASSET_KEYS.BACKGROUND_3,
    frameWidth: 640,
    frameHeight: 360,
    path: 'assets/images/foozle/background_3.png',
    frameRate: 8,
    repeat: -1,
  },
  {
    assetKey: ASSET_KEYS.PLANET,
    frameWidth: 96,
    frameHeight: 96,
    path: 'assets/images/foozle/planet.png',
    frameRate: 4,
    repeat: -1,
  },
  {
    assetKey: ASSET_KEYS.ASTEROID_EXPLODE,
    frameWidth: 96,
    frameHeight: 96,
    path: 'assets/images/foozle/asteroid_explode.png',
    frameRate: 24,
    repeat: 0,
  },
  {
    assetKey: ASSET_KEYS.BULLET,
    frameWidth: 9,
    frameHeight: 9,
    path: 'assets/images/foozle/bullet.png',
    frameRate: 8,
    repeat: -1,
  },
  {
    assetKey: ASSET_KEYS.HEART,
    frameWidth: 16,
    frameHeight: 16,
    path: 'assets/images/mikiz/hearts.png',
    frameRate: 8,
    repeat: -1,
  },
];

export const IMAGE_ASSETS = [
  {
    assetKey: ASSET_KEYS.SHIP,
    path: 'assets/images/foozle/ship.png',
  },
  {
    assetKey: ASSET_KEYS.ASTEROID,
    path: 'assets/images/foozle/asteroid.png',
  },
];

export const AUDIO_ASSETS = [
  {
    assetKey: ASSET_KEYS.BACKGROUND_MUSIC,
    path: 'assets/audio/ansimuz/space_asteroids.wav',
  },
  {
    assetKey: ASSET_KEYS.FX_EXPLOSION,
    path: 'assets/audio/ansimuz/explosion.wav',
  },
  {
    assetKey: ASSET_KEYS.FX_HIT,
    path: 'assets/audio/ansimuz/hit.wav',
  },
  {
    assetKey: ASSET_KEYS.FX_SHOT,
    path: 'assets/audio/ansimuz/shot_1.wav',
  },
];

// ---- GLUE KOD: ide NA KRAJU, kad je sve gore vec deklarisano ----

// dodaj sve skin kljuceve u ASSET_KEYS
PLANET_SKINS.forEach((s) => {
  ASSET_KEYS[s.asset] = s.asset;
});

// dodaj slike skinova u preload (IMAGE_ASSETS)
PLANET_SKINS.forEach((s) => {
  IMAGE_ASSETS.push({ assetKey: s.asset, path: s.path });
});

// mapa: ime skina (currentSkin sa backenda) -> asset planete
export const SKIN_TO_PLANET_ASSET = { defaultSkin: ASSET_KEYS.PLANET };
PLANET_SKINS.forEach((s) => {
  SKIN_TO_PLANET_ASSET[s.key] = s.asset;
});

// koji skinovi su animirani (default planeta je spritesheet)
export const ANIMATED_PLANET_SKINS = ['defaultSkin'];