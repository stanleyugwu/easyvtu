const TwColors = {
  primary: '#0F035B',
  secondary: '#F2994A',
  blue: '#1D06AD',
  dark: '#020202',
  gray: '#676767',
  black: '#333333',
  white: '#FFFFFF',
  gray5: '#E0E0E0',
  gray4: '#BDBDBD',
};

// TODO: reduce and unify font sizes. Also reduce font line-heights
/**
 * We separate font sizes for different screen resoutions
 * sizes prefixed with `b` will be used for larger screen
 */
const TwFontSize = {
  title: '26',
  subTitle: '22',
  paragraph: '16',
  caption: '14',
  small: '12',
};

const config = {
  theme: {
    extend: {
      colors: TwColors,
      fontFamily: {
        muli: ['Muli', 'sans-serif'],
      },
      fontSize: TwFontSize,
      screens: {
        sm: '380px',
        md: '620px',
        lg: '720px',
      },
    },
  },
  plugins: [],
};

module.exports = config;
