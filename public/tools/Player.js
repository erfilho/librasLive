const window = require('window');
const assign = require('object-assign');
const inherits = require('inherits');
const url = require('url-join');
const EventEmitter = require('events').EventEmitter;

const config = require('./config.js');
const PlayerManagerAdapter = require('./PlayerManagerAdapter.js');
const GlosaTranslator = require('./GlosaTranslator.js');

const document = window.document;
const location = window.location;

let globalGlosaLenght = '';

const STATUSES = {
  idle: 'idle',
  preparing: 'preparing',
  playing: 'playing',
};

function Player(options) {
  this.options = assign(
    {
      translator: config.translatorUrl,
      targetPath: 'unity',
    },
    options,
  );

  this.playerManager = new PlayerManagerAdapter();
  this.translator = new GlosaTranslator(this.options.translator);

  this.translated = false;
  this.text = undefined;
  this.gloss = undefined;
  this.loaded = false;
  this.progress = null;
  this.gameContainer = null;
  this.player = null;
  this.status = STATUSES.idle;
  this.region = 'BR';

  this.playerManager.on('load', () => {
    this.loaded = true;
    this.emit('load');

    this.playerManager.setBaseUrl(config.dictionaryUrl);

    if (this.options.onLoad) {
      this.options.onLoad();
    } else {
      this.play(null, { fromTranslation: true });
    }
  });

  this.playerManager.on('progress', (progress) => {
    this.emit('animation:progress', progress);
  });

  this.playerManager.on('stateChange', (isPlaying, isPaused, isLoading) => {
    if (isPaused) {
      this.emit('animation:pause');
    } else if (isPlaying && !isPaused) {
      this.emit('animation:play');
      this.changeStatus(STATUSES.playing);
    } else if (!isPlaying && !isLoading) {
      this.emit('animation:end');
      this.changeStatus(STATUSES.idle);
    }
  });

  this.playerManager.on('CounterGloss', (counter, glosaLenght) => {
    this.emit('response:glosa', counter, glosaLenght);
    globalGlosaLenght = glosaLenght;
  });

  this.playerManager.on('GetAvatar', (avatar) => {
    this.emit('GetAvatar', avatar);
  });

  this.playerManager.on('FinishWelcome', (bool) => {
    this.emit('stop:welcome', bool);
  });
}

inherits(Player, EventEmitter);

Player.prototype.translate = function (text, { isEnabledStats = true } = {}) {
  this.emit('translate:start');

  if (this.loaded) {
    this.stop();
  }

  this.text = text;

  this.translator.translate(text, location.host, (gloss, error) => {
    if (error) {
      this.play(text.toUpperCase());
      this.emit(
        'error',
        error === 'timeout_error' ? error : 'translation_error',
      );
      return;
    }

    this.play(gloss, { fromTranslation: true, isEnabledStats });
    this.emit('translate:end');
  });
};

Player.prototype.play = function (
  glosa,
  { fromTranslation = false, isEnabledStats = true } = {},
) {
  if (!isEnabledStats && isDefaultUrl.bind(this)()) {
    this.playerManager.setBaseUrl(
      config.dictionaryStaticUrl + this.region + '/',
    );
  } else if (isEnabledStats && !isDefaultUrl.bind(this)()) {
    this.playerManager.setBaseUrl(config.dictionaryUrl + this.region + '/');
  }

  function isDefaultUrl() {
    return (
      this.playerManager.currentBaseUrl ===
      config.dictionaryUrl + this.region + '/'
    );
  }

  this.translated = fromTranslation;
  this.gloss = glosa || this.gloss;

  if (this.gloss !== undefined && this.loaded) {
    this.changeStatus(STATUSES.preparing);
    this.playerManager.play(this.gloss);
  }
};

Player.prototype.playWellcome = function () {
  this.playerManager.playWellcome();
  this.emit('start:welcome');
};

Player.prototype.continue = function () {
  this.playerManager.play();
};

Player.prototype.repeat = function () {
  this.play();
};

Player.prototype.pause = function () {
  this.playerManager.pause();
};

Player.prototype.stop = function () {
  this.playerManager.stop();
};

Player.prototype.setSpeed = function (speed) {
  this.playerManager.setSpeed(speed);
};

Player.prototype.setPersonalization = function (personalization) {
  this.playerManager.setPersonalization(personalization);
};

Player.prototype.changeAvatar = function (avatarName) {
  this.playerManager.changeAvatar(avatarName);
};

Player.prototype.toggleSubtitle = function () {
  this.playerManager.toggleSubtitle();
};

Player.prototype.setRegion = function (region) {
  this.region = region;
  this.playerManager.setBaseUrl(config.dictionaryUrl + region + '/');
};

Player.prototype.load = function (wrapper) {
  this.gameContainer = document.createElement('div');
  this.gameContainer.setAttribute('id', 'gameContainer');
  this.gameContainer.classList.add('emscripten');

  if ('function' == typeof this.options.progress) {
    this.progress = new this.options.progress(wrapper);
  }

  wrapper.appendChild(this.gameContainer);

  this._initializeTarget();
};

Player.prototype._getTargetScript = function () {
  return url(this.options.targetPath, 'UnityLoader.js');
  //return path.join(this.options.targetPath, 'UnityLoader.js');
};

Player.prototype._initializeTarget = function () {
  //const targetSetup = path.join(this.options.targetPath, 'playerweb.json');
  const targetSetup = url(this.options.targetPath, 'playerweb.json');
  const targetScript = document.createElement('script');

  targetScript.src = this._getTargetScript();
  targetScript.onload = () => {
    this.player = UnityLoader.instantiate('gameContainer', targetSetup, {
      compatibilityCheck: (_, accept, deny) => {
        if (UnityLoader.SystemInfo.hasWebGL) {
          return accept();
        }

        this.onError('unsupported');
        alert('Seu navegador não suporta WEBGL');
        console.error('Seu navegador não suporta WEBGL');
        deny();
      },
    });

    this.playerManager.setPlayerReference(this.player);
  };

  document.body.appendChild(targetScript);
};

Player.prototype.changeStatus = function (status) {
  switch (status) {
    case STATUSES.idle:
      if (this.status === STATUSES.playing) {
        this.status = status;
        this.emit('gloss:end', globalGlosaLenght);
      }
      break;

    case STATUSES.preparing:
      this.status = status;
      break;

    case STATUSES.playing:
      if (this.status === STATUSES.preparing) {
        this.status = status;
        this.emit('gloss:start');
      }
      break;
  }
};

module.exports = Player;
