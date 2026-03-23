/**
 * prepare-standalone.js
 *
 * Cross-platform script that copies the Next.js static assets and the public
 * directory into the standalone output so the self-contained server bundle
 * includes everything it needs.
 *
 * Run automatically by `npm run tauri:build` before `tauri build`.
 */

const { cpSync, existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')

const root = resolve(__dirname, '..')

function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.warn(`[prepare-standalone] skipping missing directory: ${src}`)
    return
  }
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`[prepare-standalone] copied  ${src.replace(root, '')}  →  ${dest.replace(root, '')}`)
}

// .next/static → .next/standalone/.next/static
copyDir(
  resolve(root, '.next', 'static'),
  resolve(root, '.next', 'standalone', '.next', 'static')
)

// public → .next/standalone/public
copyDir(
  resolve(root, 'public'),
  resolve(root, '.next', 'standalone', 'public')
)

console.log('[prepare-standalone] done.')
