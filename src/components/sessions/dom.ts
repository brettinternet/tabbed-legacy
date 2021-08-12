import File from 'src/components/icons/file.svelte'

/**
 * Replaces the node with an icon when the image is unavailable
 * @usage use:handleImageError
 */
export const replaceImageError = (node: HTMLImageElement) => {
  const handleError = () => {
    if (node.parentElement) {
      new File({
        target: node.parentElement,
        anchor: node,
      })
      node.remove()
    }
  }

  node.addEventListener('error', handleError)

  return {
    destroy() {
      node.removeEventListener('error', handleError)
    },
  }
}

/**
 * Briefly highlight element
 */
export const flash = (element: HTMLElement) => {
  requestAnimationFrame(() => {
    const bg = ['bg-yellow-200', 'dark:bg-yellow-700']
    const noTransition = 'transition-none'
    element.classList.add(...bg, noTransition)

    setTimeout(() => {
      element.classList.remove(...bg, noTransition)
      const bgTransition = ['transition-colors', 'duration-1000']
      element.classList.add(...bgTransition)
      setTimeout(() => {
        element.classList.remove(...bgTransition)
      }, 1000)
    }, 250)
  })
}
