export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#f25a05',
          orangeDark: '#d94f04',
          charcoal: '#18181b',
          muted: '#fafafa',
          border: '#e7e7e7',
          text: '#18181b',
          softText: '#5f5a56',
          success: '#16803c',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
};
