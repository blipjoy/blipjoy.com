import { Enum, Variant } from './enum.js';
import { get_css_prop } from './css.js';

/** @type {Number} */
const GLITCH_MIN = 25000;

/** @type {Number} */
const GLITCH_MAX = 60000;

/** @type {Number} */
const RESET_MIN = 50;

/** @type {Number} */
const RESET_MAX = 200;

export class BlipJoyAnimation {
  /** @type {CanvasRenderingContext2D} */
  #ctx;

  /** @type {Number} */
  #width;

  /** @type {Number} */
  #height;

  /** @type {AnimState[]} */
  #state;

  /** @type {Number} */
  #index = 0;

  /** @type {Boolean} */
  #running = false;

  /** @type {ImageData | null} */
  #pixels = null;

  /** @type {String} */
  #invader_color;

  /** @type {String} */
  #text_color;

  constructor() {
    /** @type {HTMLCanvasElement | null} */
    const canvas = document.querySelector('#anim');
    if (canvas === null) {
      throw new TypeError('#anim element does not exist');
    }
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new TypeError('Unable to get a 2D rendering context');
    }

    this.#ctx = ctx;
    this.#width = canvas.width;
    this.#height = canvas.height;
    this.#state = [
      new AnimState(500, DrawEnum.B()),
      new AnimState(200, DrawEnum.L()),
      new AnimState(500, DrawEnum.I()),
      new AnimState(150, DrawEnum.P()),
      new AnimState(150, DrawEnum.J()),
      new AnimState(250, DrawEnum.O()),
      new AnimState(500, DrawEnum.Y()),
      new AnimState(Math.random() * GLITCH_MAX + GLITCH_MIN, DrawEnum.GLITCH_INIT()),
      new AnimState(Math.random() * RESET_MAX + RESET_MIN, DrawEnum.GLITCH_CONTINUE()),
      new AnimState(Math.random() * RESET_MAX + RESET_MIN, DrawEnum.RESET()),
    ];
    this.#invader_color = get_css_prop('--logo-color');
    this.#text_color = get_css_prop('--logo-text-color');

    this.#invader();
    this.#step();
  }

  /** Draw the BlipJoy Invader. */
  #invader() {
    const ctx = this.#ctx;

    // Left half
    ctx.fillStyle = this.#invader_color;
    ctx.fillRect(128, 0, 16, 16);
    ctx.fillRect(144, 16, 16, 16);
    ctx.fillRect(160, 32, 16, 16);
    ctx.fillRect(176, 32, 16, 48);
    ctx.fillRect(144, 48, 16, 16);
    ctx.fillRect(128, 64, 16, 48);
    ctx.fillRect(128, 64, 16, 48);
    ctx.fillRect(160, 64, 16, 32);
    ctx.fillRect(176, 96, 16, 16);
    ctx.fillRect(144, 112, 16, 16);

    // Right half
    createImageBitmap(ctx.canvas, 128, 0, 64, 128).then((bitmap) => {
      ctx.scale(-1, 1);
      ctx.drawImage(bitmap, -256, 0);
      ctx.scale(-1, 1);
    });
  }

  #step() {
    const state = this.#state[this.#index];
    if (state.remaining <= 0) {
      this.#action(state);
    }

    setTimeout(this.#step.bind(this), this.#state[this.#index].remaining);
  }

  /** @arg {AnimState} state - The action to perform when the timer expires. */
  #action(state) {
    const ctx = this.#ctx;

    switch (state.draw.value) {
    case DrawEnum.VARIANT_B:
      ctx.fillStyle = this.#text_color;
      ctx.fillRect(0, 144, 16, 80);
      ctx.fillRect(16, 144, 16, 16);
      ctx.fillRect(32, 160, 16, 16);
      ctx.fillRect(16, 176, 16, 16);
      ctx.fillRect(32, 192, 16, 16);
      ctx.fillRect(16, 208, 16, 16);
      this.#index = DrawEnum.VARIANT_L;
      break;

    case DrawEnum.VARIANT_L:
      ctx.fillRect(64, 144, 16, 80);
      ctx.fillRect(80, 208, 32, 16);
      this.#index = DrawEnum.VARIANT_I;
      break;

    case DrawEnum.VARIANT_I:
      ctx.fillRect(128, 144, 16, 16);
      ctx.fillRect(128, 176, 16, 48);
      this.#index = DrawEnum.VARIANT_P;
      break;

    case DrawEnum.VARIANT_P:
      ctx.fillRect(160, 144, 16, 80);
      ctx.fillRect(176, 144, 16, 16);
      ctx.fillRect(192, 160, 16, 16);
      ctx.fillRect(176, 176, 16, 16);
      this.#index = DrawEnum.VARIANT_J;
      break;

    case DrawEnum.VARIANT_J:
      ctx.fillRect(208, 192, 16, 16);
      ctx.fillRect(224, 208, 16, 16);
      ctx.fillRect(240, 144, 16, 64);
      this.#index = DrawEnum.VARIANT_O;
      break;

    case DrawEnum.VARIANT_O:
      ctx.fillRect(288, 144, 16, 16);
      ctx.fillRect(272, 160, 16, 48);
      ctx.fillRect(288, 208, 16, 16);
      ctx.fillRect(304, 160, 16, 48);
      this.#index = DrawEnum.VARIANT_Y;
      break;

    case DrawEnum.VARIANT_Y:
      ctx.fillRect(336, 144, 16, 32);
      ctx.fillRect(368, 144, 16, 32);
      ctx.fillRect(352, 176, 16, 48);
      this.#index = DrawEnum.VARIANT_GLITCH_INIT;
      break;

    case DrawEnum.VARIANT_GLITCH_INIT:
      this.#pixels = ctx.getImageData(0, 0, this.#width, this.#height);
      state.reset(Math.random() * GLITCH_MAX + GLITCH_MIN);
      this.#index = DrawEnum.VARIANT_GLITCH_CONTINUE;
      break;

    case DrawEnum.VARIANT_GLITCH_CONTINUE:
      for (let i = 0; i < Math.floor(Math.random() * 60 + 20); i++) {
        const sx = Math.max(Math.floor(Math.random() * this.#width - 64), 0);
        const sy = Math.floor(Math.random() * this.#height);
        const dx = Math.max(Math.floor(Math.random() * this.#width - 64), 0);
        const dy = Math.floor(Math.random() * this.#height);
        const w = Math.floor(Math.random() * this.#width + 32);
        const h = Math.floor(Math.random() * 8 + 1);

        createImageBitmap(ctx.canvas, sx, sy, w, h).then((bitmap) => {
          ctx.drawImage(bitmap, dx, dy);
          ctx.clearRect(sx, sy, w, h);
        });
      }

      state.reset(Math.random() * RESET_MAX + RESET_MIN);

      // Advance to the next state more often than not
      if (Math.floor(Math.random() * 8) !== 0) {
        this.#index = DrawEnum.VARIANT_RESET;
      }
      break;

    case DrawEnum.VARIANT_RESET:
      if (this.#pixels != null) {
        ctx.putImageData(this.#pixels, 0, 0);
      }

      state.reset(Math.random() * RESET_MAX + RESET_MIN);
      this.#index = DrawEnum.VARIANT_GLITCH_INIT;
      break;

    default:
      throw new RangeError('Unexpected variant');
    }
  }
}

class AnimState {
  /** @type {Number} */
  #start = 0;

  /** @type {Number} */
  #duration;

  /** @type {Variant} */
  #draw;

  /**
   * @arg {Number} duration - Lifetime of this state in milliseconds.
   * @arg {Variant} draw - The action to perform when the timer expires.
   */
  constructor(duration, draw) {
    this.#duration = duration;
    this.#draw = draw;
  }

  /** @return {Variant} */
  get draw() {
    return this.#draw;
  }

  /** @return {Number} */
  get remaining() {
    const now = Date.now();

    if (this.#start === 0) {
      this.#start = now;
    }

    const elapsed = now - this.#start;
    return elapsed < this.#duration ? this.#duration - elapsed : 0;
  }

  /** @arg {Number} duration */
  reset(duration) {
    this.#start = 0;
    this.#duration = duration;
  }
}

class DrawEnum extends Enum {
  static VARIANT_B = 0;
  static VARIANT_L = 1;
  static VARIANT_I = 2;
  static VARIANT_P = 3;
  static VARIANT_J = 4;
  static VARIANT_O = 5;
  static VARIANT_Y = 6;
  static VARIANT_GLITCH_INIT = 7;
  static VARIANT_GLITCH_CONTINUE = 8;
  static VARIANT_RESET = 9;

  /** @return {Variant} */
  static B() {
    return new Variant(new Enum(DrawEnum.VARIANT_B));
  }

  /** @return {Variant} */
  static L() {
    return new Variant(new Enum(DrawEnum.VARIANT_L));
  }

  /** @return {Variant} */
  static I() {
    return new Variant(new Enum(DrawEnum.VARIANT_I));
  }

  /** @return {Variant} */
  static P() {
    return new Variant(new Enum(DrawEnum.VARIANT_P));
  }

  /** @return {Variant} */
  static J() {
    return new Variant(new Enum(DrawEnum.VARIANT_J));
  }

  /** @return {Variant} */
  static O() {
    return new Variant(new Enum(DrawEnum.VARIANT_O));
  }

  /** @return {Variant} */
  static Y() {
    return new Variant(new Enum(DrawEnum.VARIANT_Y));
  }

  /** @return {Variant} */
  static GLITCH_INIT() {
    return new Variant(new Enum(DrawEnum.VARIANT_GLITCH_INIT));
  }

  /** @return {Variant} */
  static GLITCH_CONTINUE() {
    return new Variant(new Enum(DrawEnum.VARIANT_GLITCH_CONTINUE));
  }

  /** @return {Variant} */
  static RESET() {
    return new Variant(new Enum(DrawEnum.VARIANT_RESET));
  }
}
