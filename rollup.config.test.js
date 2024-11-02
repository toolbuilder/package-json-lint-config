import createTestPackageJson from 'rollup-plugin-create-test-package-json'
import createPackFile from '@toolbuilder/rollup-plugin-create-pack-file'
import runCommands, { shellCommand } from '@toolbuilder/rollup-plugin-commands'
import { tmpdir } from 'os'
import { join } from 'path'
import { globSync } from 'glob'

// This is where the test package is created
const testPackageDir = join(tmpdir(), `${Date.now()}`)

export default [
  {
    // process all unit tests, and specify output in 'test' directory of testPackageDir
    input: globSync('test/**/*test.js'),
    external: (id) => !id.startsWith('.'),
    output: {
      format: 'es',
      dir: testPackageDir,
      preserveModules: true, // Generate one unit test for each input unit test
      preserveModulesRoot: '.' // keep same file structure in testPackageDir
    },
    plugins: [
      createTestPackageJson({ // Creates package.json for testPackageDir
        // Provide information that plugin can't pick up for itself
        type: 'module',
        testPackageJson: {
          scripts: {
            test: 'run-s unit check',
            check: 'npmPkgJsonLint .',
            unit: 'pta --reporter tap "test/**/*test.js"'
          },
          // dependencies are populated automatically based on unit test imports
          devDependencies: {
            // These are the dependencies for the test runner
            pta: '^1.3.0',
            zora: '^6.0.0',
            'npm-package-json-lint': '^8.0.0',
            'npm-run-all': '^4.1.5'
          },
          npmpackagejsonlint: {
            extends: '@toolbuilder/package-json-lint-config',
            overrides: [
              {
                patterns: ['.'], // turn these rules off for entire package
                rules: {
                  'description-format': 'off',
                  'require-license': 'off',
                  'require-repository': 'off',
                  'require-bugs': 'off',
                  'require-homepage': 'off',
                  'require-keywords': 'off',
                  'no-file-dependencies': 'off',
                  'prefer-alphabetical-devDependencies': 'off'
                }
              }
            ]
          }
        }
      }),
      createPackFile({ // and move it to output.dir (i.e. testPackageDir)
        packCommand: 'pnpm pack'
      }),
      runCommands({
        commands: [
          // Install dependencies and run the unit test
          // The -C parameter ensures that the test does not resolve
          // any packages outside testPackageDir. Ordinarily, it
          // would pickup packages in this package too.
          shellCommand(`pnpm -C ${testPackageDir} install-test`)
        ]
      })
    ]
  }
]
