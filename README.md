# package-json-lint-config

Shareable config for [npm-package-json-lint](https://github.com/tclindner/npm-package-json-lint).

## Installation

```bash
pnpm add --save-dev npm-package-json-lint # the linter
pnpm add --save-dev @toolbuilder/package-json-lint-config
```

## Usage

```json
  "scripts": {
    "lint:packagejson": "npmPkgJsonLint -c \"@toolbuilder/package-json-lint-config\" ."
  }
```

You can also override, or extend this configuration as specified by `npm-package-json-lint`.
