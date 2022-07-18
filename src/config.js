const StyleDictionaryPackage = require('style-dictionary')

function registerConfig({ current, buildPath }) {
  
  return {
    "source": [current.source],
    "platforms": {
      'web/css': {
        "transformGroup": "css",
        "buildPath": buildPath.css,
        "files": [{
          "destination": `${current.filename}.css`,
          "format": "css/variables",
        }]
      },
      'web/scss': {
        "transformGroup": "scss",
        "buildPath": buildPath.scss,
        "files": [
          {
            "destination": `${current.filename}.scss`,
            "format": "scss/variables",
            "filter": "isNotObject"
          },
          {
            "destination": `mixins.scss`,
            "format": "scss/mixin",
            "filter": "isObject"
          }
        ]
      }
    }
  }
}

function registerFilter() {
  StyleDictionaryPackage.registerFilter({
    name: 'isObject',
    matcher: function(token) {
      return typeof token.value === 'object';
    }
  });

  StyleDictionaryPackage.registerFilter({
    name: 'isNotObject',
    matcher: function(token) {
      return typeof token.value !== 'object';
    }
  })
}

function registerFormat() {
  StyleDictionaryPackage.registerFormat({
    name: 'scss/mixin',
    formatter: function({ dictionary }) {
      let output = ''

      dictionary.allProperties.map(prop => {
        if (prop.attributes.category === 'switch') {
          output += `
            @if $type == switch-${prop.attributes.type} {
              transition-duration = ${prop.value.velocity};
              transition-timing-function = ${prop.value.vibe};
            }
          `
        }

        if (prop.attributes.category === 'spin') {
          output += `
            @if $type == spin-${prop.attributes.type} {
              transition-duration = ${prop.value.velocity};
              transition-timing-function = ${prop.value.vibe};

              #($trigger) {
                transform: rotate(${prop.value.rotation})
              }
            }
          `
        }

        if (prop.attributes.category === 'expand') {
          output += `
            @if $type == expand-${prop.attributes.type} {
              transition-duration = ${prop.value.velocity};
              transition-timing-function = ${prop.value.vibe};

              #($trigger) {
                transform: rotate(${prop.value.scale})
              }
            }
          `
        }
      })

      return `
        @mixin motion-token($type, $trigger) {
          ${output}
        }
      `
    }
  })
}

module.exports = {
  registerConfig,
  registerFilter,
  registerFormat
}