module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cyberpunk palette — azul brillante + violeta brillante
        'dark-bg': '#04040f',
        'dark-card': '#0a0a1e',
        'neon-green': '#00d4ff',   // Azul eléctrico brillante (ex-verde)
        'neon-cyan': '#bf00ff',    // Violeta brillante (ex-cyan)
        'neon-yellow': '#ff0099',  // Rosa/magenta (ex-amarillo)
        'text-light': '#c8c8ff',   // Blanco con tinte azul
        'border-dark': '#1a1a4e',  // Borde azul oscuro
      },
      fontFamily: {
        'display': ['Orbitron', 'monospace'],
        'mono': ['Source Code Pro', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(0, 212, 255, 0.9), 0 0 60px rgba(0, 212, 255, 0.5), 0 0 80px rgba(191, 0, 255, 0.3)',
          },
        },
      },
    },
  },
  plugins: [],
};
