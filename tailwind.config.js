
/**
 * @type {import("twrnc").TwConfig}
 */
const config = {
  theme: {
    extend: {
      colors: {
        primary: '#0F035B',
        secondary: '#F2994A',
        blue: '#1D06AD',
        dark: '#020202',
        gray: '#676767',
        black: '#333333',
        white: '#FFFFFF',
        gray5:"#E0E0E0",
        gray4:"#BDBDBD",
      },
      fontFamily: {
        muli: ['Muli', 'sans-serif'],
      },
      fontSize: {
        title: '28',
        subTitle: '24',
        paragraph: '18',
        caption:'16'
      },
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
