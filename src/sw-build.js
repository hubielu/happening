const workboxBuild = require('workbox-build');

const buildSW = () => {
  return workboxBuild.injectManifest({
    swSrc: 'src/custom-service-worker.js',
    swDest: 'build/service-worker.js',
    globDirectory: 'build',
    globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
  });
};

buildSW();