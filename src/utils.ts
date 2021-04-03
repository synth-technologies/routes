import { RouteComponentProps } from 'react-router'
import * as React from 'react'

export const loginRequired = (render: (props: RouteComponentProps<any>) => React.ReactNode, isAuthenticated: () => boolean, onNotAuthenticated: () => void) => {
  return (props: RouteComponentProps<any>) => {
    if (isAuthenticated()) {
      return render(props)
    }
    onNotAuthenticated()
    return undefined
  }
}

export const isExternal = (pathOrUrl: string) => {
  let external = false
  let target = ""
  try {
    if (pathOrUrl.startsWith("//")) {
      external = true
      target = "_blank"
    } else {
      const parsed = new URL(pathOrUrl)
      external = parsed.protocol !== ""
      target = ["https:", "http:"].includes(parsed.protocol) ? "_blank" : ""
    }
  } catch (e) {
    external = false
    target = ""
  }
  return { external, target }
}
