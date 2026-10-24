import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = resolve(import.meta.dirname, '..', '..', 'floodcontrol-frontend')
const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8')) as {
  engines?: { node?: string }
}
const mise = readFileSync(resolve(projectRoot, '.mise.toml'), 'utf8')

function readSourceTree(directory: string): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(directory, entry.name)
      return entry.isDirectory() ? readSourceTree(path) : [readFileSync(path, 'utf8')]
    })
    .join('\n')
}

describe('runtime security contract', () => {
  it('requires the patched Node.js release line', () => {
    expect(packageJson.engines?.node).toBe('>=22.23.4')
    expect(mise).toContain('node = "22.23.4"')
  })

  it('contains no dangerous runtime sinks in application/config code', () => {
    const source = [readSourceTree(resolve(projectRoot, 'src')), readFileSync(resolve(projectRoot, 'vite.config.ts'), 'utf8')].join('\n')

    expect(source).not.toMatch(/node:zlib|child_process|(?:^|[^\w])exec(?:Sync)?\s*\(|spawn(?:Sync)?\s*\(|eval\s*\(|new Function\s*\(/)
  })
})
