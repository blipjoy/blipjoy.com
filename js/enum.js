export class Enum {
  /** @type {Number} */
  #enum_value;

  /** @arg {Number} value */
  constructor(value = -1) {
    this.#enum_value = value;
  }

  /** @return {Number} */
  get value() {
    this.check();

    return this.#enum_value;
  }

  /** @return {Enum} */
  check() {
    if (this.#enum_value < 0) {
      throw new RangeError('This enum is not initialized');
    }

    return this;
  }
}

export class Variant {
  /** @type Enum */
  #value;

  /** @arg {Enum} value */
  constructor(value) {
    this.#value = value.check();
  }

  /** @return {Number} */
  get value() {
    return this.#value.value;
  }
}
