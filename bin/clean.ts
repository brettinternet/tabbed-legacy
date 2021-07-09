import { rmSync } from 'fs'
import { resolve } from 'path'

const projectRoot = resolve(__dirname, '..')
const queue = [resolve(projectRoot, '.dist'), resolve(projectRoot, 'coverage')]

queue.forEach(dir => {
  rmSync(dir, { recursive: true })
})
