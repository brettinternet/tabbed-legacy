import File from 'src/components/icons/file.svelte'

/**
 * Replaces the node with an icon when the image is unavailable
 * @usage use:handleImageError
 */
export const replaceImageError = (node: HTMLImageElement) => {
  const handleError = () => {
    new File({
      target: node.parentElement,
      anchor: node,
    })
    node.remove()
  }

  node.addEventListener('error', handleError)

  return {
    destroy() {
      node.removeEventListener('error', handleError)
    },
  }
}
