import StyleDictionary from 'style-dictionary';

// ponytail: theme segment ("semantic.light" / "semantic.dark") is dropped from the
// generated variable name so light.css and dark.css both emit the same --color-* names,
// just scoped to a different selector. Flip theme = swap which file's selector is active.
StyleDictionary.registerTransform({
  name: 'name/strip-theme',
  type: 'name',
  transform: (token) =>
    token.path.filter((part) => part !== 'semantic' && part !== 'light' && part !== 'dark').join('-'),
});

const isSemanticFor = (theme) => (token) =>
  token.path[0] === 'color' && token.path[1] === 'semantic' && token.path[2] === theme;

const isNonColor = (token) => token.path[0] !== 'color';

export default {
  source: ['tokens/tokens.json'],
  platforms: {
    base: {
      transformGroup: 'css',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'base.css',
          format: 'css/variables',
          filter: isNonColor,
          options: { selector: ':root' },
        },
      ],
    },
    light: {
      transforms: ['name/strip-theme', 'color/css'],
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'light.css',
          format: 'css/variables',
          filter: isSemanticFor('light'),
          options: { selector: ':root' },
        },
      ],
    },
    dark: {
      transforms: ['name/strip-theme', 'color/css'],
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'dark.css',
          format: 'css/variables',
          filter: isSemanticFor('dark'),
          options: { selector: "[data-theme='dark']" },
        },
      ],
    },
  },
};
