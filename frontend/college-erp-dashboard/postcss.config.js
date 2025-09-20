// PostCSS config for Tailwind CSS (v4) and Autoprefixer
// Note: Tailwind's PostCSS plugin moved to '@tailwindcss/postcss'
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
