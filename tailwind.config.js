const TwColors = {
  primary: '#0F035B',
  secondary: '#F2994A',
  blue: '#1D06AD',
  dark: '#020202',
  gray: '#676767',
  black: '#333333',
  white: '#FFFFFF',
  gray5: '#f1f1f1',
  gray4: '#dfdfdf',
};

const TwFontSize = {
  title: '24',
  subTitle: '20',
  paragraph: '14',
  caption: '12',
  small: '10',
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
