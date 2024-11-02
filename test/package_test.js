import config from '@toolbuilder/package-json-lint-config'
import { test } from 'zora'

test('test that can access properties from exported object', assert => {
  const result = config.rules['description-type']
  const expected = 'error'
  assert.deepEqual(result, expected, 'expected config value')
})
