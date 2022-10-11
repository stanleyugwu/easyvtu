/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const {getDefaultConfig} = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      // below resolver will resolve imports starting with
      // `assets:` and `components:` to app assets and components
      // folder respetively
      resolveRequest: (context, moduleName, platform) => {
        // resolves `assets:`
        if (moduleName.startsWith('assets:')) {
          const realPath = moduleName.substring(moduleName.indexOf(':') + 1);
          const resolvedPath = path.resolve('assets', realPath);
          return {
            // NOTE: below is supposed to be `filePaths` and `type:'assetFiles'`
            // but it throws error from metro Module resolver
            filePath: resolvedPath,
            type: 'sourceFile',
          };
        }

        // // resolves `components:`
        if (moduleName.startsWith('components:')) {
          const realPath = moduleName.substring(moduleName.indexOf(':') + 1);
          const resolvedPath = path.resolve('components', realPath);
          return {
            filePath: resolvedPath,
            type: 'sourceFile',
          };
        }
        // import doesn't start with `assets/`
        return context.resolveRequest(context, moduleName, platform);
      },
    },
  };
})();

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// };
