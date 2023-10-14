export function shouldUpdateComponent(oldProps, newProps) {
  for (const key in newProps) {
    if (Object.prototype.hasOwnProperty.call(newProps, key)) {
      if (oldProps[key] !== newProps[key])
        return true
    }
  }
  return false
}
