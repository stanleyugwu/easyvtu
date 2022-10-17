const TwColors = {
  primary: '#0F035B',
  secondary: '#F2994A',
  blue: '#1D06AD',
  dark: '#020202',
  gray: '#676767',
  black: '#333333',
  white: '#FFFFFF',
  gray5:"#E0E0E0",
  gray4:"#BDBDBD",
};

// TODO: reduce and unify font sizes. Also reduce font line-heights
/**
 * We separate font sizes for different screen resoutions
 * sizes prefixed with `b` will be used for larger screen
 */
const TwFontSize = {
  btitle: '28',
  title: '26',

  bsubTitle: '24',
  subTitle: '24',

  bparagraph: '18',
  paragraph: '16',

  bcaption:'16',
  caption:'14'
}

const config = {
  theme: {
    extend: {
      colors:TwColors,
      fontFamily: {
        muli: ['Muli', 'sans-serif'],
      },
      fontSize:TwFontSize,
      screens:{
        sm: '380px',
      md: '420px',
      lg: '680px',
      }
    },
  },
  plugins: [

  ],
};

module.exports = config;
