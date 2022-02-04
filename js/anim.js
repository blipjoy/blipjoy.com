import { Enum, Variant } from './enum.js';

export class BlipJoyAnimation {
  /** @type {CanvasRenderingContext2D} */
  #ctx;

  /** @type {AnimState[]} */
  #state;

  /** @type {Number} */
  #index = 0;

  /** @type {Boolean} */
  #running = false;

  constructor() {
    /** @type {HTMLCanvasElement | null} */
    let canvas = document.querySelector('#anim');
    if (canvas === null) {
      throw new TypeError('#anim element does not exist');
    }
    let ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new TypeError('Unable to get a 2D rendering context');
    }

    this.#ctx = ctx;
    this.#state = [
      new AnimState(500, DrawEnum.B()),
      new AnimState(200, DrawEnum.L()),
      new AnimState(500, DrawEnum.I()),
      new AnimState(150, DrawEnum.P()),
      new AnimState(150, DrawEnum.J()),
      new AnimState(250, DrawEnum.O()),
      new AnimState(500, DrawEnum.Y()),
    ];

    this.#invader();
    this.#step();
  }

  /** Draw the BlipJoy Invader. */
  #invader() {
    const ctx = this.#ctx;

    // Left half
    ctx.fillStyle = '#4b0082';
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
    if (this.#index >= this.#state.length) {
      throw new RangeError('step() called after animation completion');
    }

    const state = this.#state[this.#index];
    if (state.remaining <= 0) {
      this.#index += 1;

      this.#action(state.draw);
    }

    if (this.#index < this.#state.length) {
      setTimeout(this.#step.bind(this), this.#state[this.#index].remaining);
    }
  }

  /** @arg {Variant} draw - The action to perform when the timer expires. */
  #action(draw) {
    const ctx = this.#ctx;

    switch (draw.value) {
    case DrawEnum.VARIANT_B:
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 144, 16, 80);
      ctx.fillRect(16, 144, 16, 16);
      ctx.fillRect(32, 160, 16, 16);
      ctx.fillRect(16, 176, 16, 16);
      ctx.fillRect(32, 192, 16, 16);
      ctx.fillRect(16, 208, 16, 16);
      break;

    case DrawEnum.VARIANT_L:
      ctx.fillRect(64, 144, 16, 80);
      ctx.fillRect(80, 208, 32, 16);
      break;

    case DrawEnum.VARIANT_I:
      ctx.fillRect(128, 144, 16, 16);
      ctx.fillRect(128, 176, 16, 48);
      break;

    case DrawEnum.VARIANT_P:
      ctx.fillRect(160, 144, 16, 80);
      ctx.fillRect(176, 144, 16, 16);
      ctx.fillRect(192, 160, 16, 16);
      ctx.fillRect(176, 176, 16, 16);
      break;

    case DrawEnum.VARIANT_J:
      ctx.fillRect(208, 192, 16, 16);
      ctx.fillRect(224, 208, 16, 16);
      ctx.fillRect(240, 144, 16, 64);
      break;

    case DrawEnum.VARIANT_O:
      ctx.fillRect(288, 144, 16, 16);
      ctx.fillRect(272, 160, 16, 48);
      ctx.fillRect(288, 208, 16, 16);
      ctx.fillRect(304, 160, 16, 48);
      break;

    case DrawEnum.VARIANT_Y:
      ctx.fillRect(336, 144, 16, 32);
      ctx.fillRect(368, 144, 16, 32);
      ctx.fillRect(352, 176, 16, 48);
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
}

class DrawEnum extends Enum {
  static VARIANT_B = 0;
  static VARIANT_L = 1;
  static VARIANT_I = 2;
  static VARIANT_P = 3;
  static VARIANT_J = 4;
  static VARIANT_O = 5;
  static VARIANT_Y = 6;

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
}
