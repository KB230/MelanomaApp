/*
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: ['txt', 'jpg', 'png', 'ttf', 'bin'], // Add 'bin' to assetExts
      sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
      blockList: /platform_node/, // Correct usage of blockList with a RegExp
    },
  };
})();
*/ 

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg').concat(['bin']),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

module.exports = config;