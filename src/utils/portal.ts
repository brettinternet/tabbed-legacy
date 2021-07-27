/**
 * Handle appending an element to body
 * @usage use:portal
 */
export const portal = (
  node: HTMLElement,
  { selector = 'body', prepend = false } = {}
) => {
  const update = (selector: string) => {
    const parent: HTMLElement | null = document.querySelector(selector)
    if (parent) {
      if (prepend) {
        parent.prepend(node)
      } else {
        parent.appendChild(node)
      }
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
