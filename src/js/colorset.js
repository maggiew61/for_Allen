const color = (function () {
  return {
    generate(range) {
      const rgbSet = [];
      for (let i = 0; i < range;) {
        const r = ('0' + parseInt(Math.round(Math.random() * 255), 10).toString(16)).slice(-2);
        const g = ('0' + parseInt(Math.round(Math.random() * 255), 10).toString(16)).slice(-2);
        const b = ('0' + parseInt(Math.round(Math.random() * 255), 10).toString(16)).slice(-2);
        if (rgbSet.indexOf(`#${r}${g}${b}`) < 0) {
          rgbSet.push(`#${r}${g}${b}`);
          i += 1;
        }
      }
      return rgbSet;
    },
    rgb2hex(rgb) {
      const hexrgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
      return (rgb && rgb.length === 4) ? '#' +
      ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    },
  };
}());

export default color;
