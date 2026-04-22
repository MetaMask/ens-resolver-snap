module.exports = {
  preset: '@metamask/snaps-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },

  // Jest <30 doesn't support Prettier 3.
  prettierPath: require.resolve('prettier-2'),
};
