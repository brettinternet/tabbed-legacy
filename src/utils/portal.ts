/**
 * Handle appending an element to body
 * @usage use:portal
 */
export const portal = (node: HTMLElement, selector = 'body') => {
  const update = (selector: string) => {
    const target: HTMLElement | null = document.querySelector(selector)
    if (target) {
      target.appendChild(node)
    } else {
      throw Error(`Target selector ${selector} not found`)
    }
  }

  update(selector)

  return {
    update,
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
    },
  }
}
