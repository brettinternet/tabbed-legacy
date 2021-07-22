/**
 * Handle clicking outside an element
 * @usage use:handleImageError
 */
export const clickAway = (node: HTMLElement) => {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (node && !node.contains(target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('clickAway', event))
    }
  }

  document.addEventListener('click', handleClick, true)

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    },
  }
}
