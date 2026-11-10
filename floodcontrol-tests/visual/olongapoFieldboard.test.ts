import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const repositoryRoot = resolve(import.meta.dirname, '..', '..')
const frontendRoot = resolve(repositoryRoot, 'floodcontrol-frontend')

function readFrontendSource(relativePath: string): string {
  return readFileSync(resolve(frontendRoot, 'src', relativePath), 'utf8')
}

describe('Olongapo civic operations visual contract', () => {
  it('ships the official local identity assets', () => {
    const assetPaths = [
      resolve(frontendRoot, 'public/assets/olongapo/logo-olongapo.png'),
      resolve(frontendRoot, 'public/assets/olongapo/main-banner.png'),
    ]

    for (const assetPath of assetPaths) {
      expect(existsSync(assetPath)).toBe(true)
      expect(statSync(assetPath).size).toBeGreaterThan(0)
    }
  })

  it('uses the dark Industrial token system and reduced-motion guard', () => {
    const styles = readFileSync(
      resolve(frontendRoot, 'src/app/styles/index.css'),
      'utf8',
    )

    expect(styles).toContain("'IBM Plex Mono'")
    expect(styles).toContain('--signal: #ffb800')
    expect(styles).toContain('--surface-deep: #050605')
    expect(styles).toContain('prefers-reduced-motion')
  })

  it('uses Olongapo identity and fieldboard navigation across the shell', () => {
    const auth = readFrontendSource('features/authentication/ui/AuthScreen.tsx')
    const navigation = readFrontendSource(
      'features/dashboard-navigation/ui/DashboardNavigation.tsx',
    )
    const pageHeading = readFrontendSource('shared/ui/PageHeading.tsx')

    expect(auth).toContain('/assets/olongapo/main-banner.png')
    expect(auth).toContain('Olongapo City')
    expect(auth).toContain('Demo environment')
    expect(navigation).toContain('CityMark')
    expect(navigation).toContain('["01", "Overview", "dashboard"]')
    expect(pageHeading).toContain('SectionFolio')
    expect(pageHeading).toContain('Olongapo City')
  })

  it('removes stale product identity copy from the frontend source', () => {
    const sourceFiles = [
      'features/authentication/ui/AuthScreen.tsx',
      'features/dashboard-navigation/ui/DashboardNavigation.tsx',
      'widgets/dashboard-shell/ui/DashboardShell.tsx',
      'shared/ui/PageHeading.tsx',
      'routes/__root.tsx',
    ]

    for (const sourceFile of sourceFiles) {
      const source = readFrontendSource(sourceFile)
      expect(source).not.toContain('San Isidro City')
      expect(source).not.toContain('iFlood 2.0')
      expect(source).not.toContain('Tuesday, 24 June')
    }
  })
})
