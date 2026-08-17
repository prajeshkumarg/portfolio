import next from 'eslint-config-next';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', '.claude/**'],
  },
  ...next,
];

export default config;
