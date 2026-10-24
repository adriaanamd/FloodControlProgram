import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const repositoryRoot = resolve(import.meta.dirname, '..', '..')
const rootPackagePath = resolve(repositoryRoot, 'package.json')
const frontendPackagePath = resolve(repositoryRoot, 'floodcontrol-frontend', 'package.json')

describe('npm installation boundaries', () => {
  it('keeps root installation independent from the frontend installation', () => {
    expect(existsSync(rootPackagePath)).toBe(true)
    expect(existsSync(resolve(repositoryRoot, 'floodcontrol-frontend', 'pnpm-lock.yaml'))).toBe(true)

    const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf8')) as {
      private?: boolean
      workspaces?: unknown[]
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const frontendPackage = JSON.parse(readFileSync(frontendPackagePath, 'utf8')) as { private?: boolean }

    expect(rootPackage.private).toBe(true)
    expect(rootPackage.workspaces).toEqual([])
    expect(rootPackage.dependencies ?? {}).toEqual({})
    expect(rootPackage.devDependencies ?? {}).toEqual({})
    expect(frontendPackage.private).toBe(true)
  })
})
