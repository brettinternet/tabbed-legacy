import { rmSync } from 'fs'
import { resolve } from 'path'

const projectRoot = resolve(__dirname, '..')
const queue = [resolve(projectRoot, 'dist'), resolve(projectRoot, 'coverage')]

queue.forEach((dir) => {
  try {
    rmSync(dir, { recursive: true })
  } catch (_err) {} // eslint-disable-line no-empty
})
