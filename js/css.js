/** @type {CSSStyleRule[]} */
const cache = [];

/**
 * @arg {String} prop
 * @return {String}
 */
export function get_css_prop(prop) {
  for (const rule of css_cache()) {
    for (const key of rule.style) {
      if (prop === key) {
        return rule.style.getPropertyValue(key);
      }
    }
  }

  throw new TypeError(`CSS property not found: ${prop}`);
}

/** @return {CSSStyleRule[]} */
function css_cache() {
  if (cache.length == 0) {
    const rules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .flatMap((rule) => {
        if (rule instanceof CSSImportRule) {
          return [...rule.styleSheet.cssRules];
        }
        return rule;
      })
      .filter((rule) => rule instanceof CSSStyleRule)
      .map((rule) => {
        if (!(rule instanceof CSSStyleRule)) {
          throw new TypeError('Unexpected CSSRule');
        }
        return rule;
      });

    for (const rule of rules) {
      cache.push(rule);
    }
  }

  return cache;
}
