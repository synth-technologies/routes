import * as React from 'react'
import { Helmet } from 'react-helmet'
import { matchPath, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { QueryParamProvider } from 'use-query-params'


export interface MetaData {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  faviconUrl: string
}

export interface RouteParams {
  meta: MetaData
  path: string
  makePath: (...args: any) => string
  loginRequired: boolean
  makeComponent: (props: any) => React.ReactNode
}

export interface RouteSet {
  [key: string]: RouteParams
}

export const MetaDataToHelmet = (props: { meta: MetaData, baseDomain: string }) => {
  return (
    <Helmet>
      {props.meta?.title && <title>{props.meta.title}</title>}
      {props.meta.title && <title>{props.meta.title}</title>}
      {props.meta.title && <meta property='og:title' content={props.meta.title} />}
      {props.meta.description && <meta name='description' content={props.meta.description} />}
      {props.meta.description && <meta property='og:description' content={props.meta.description} />}
      {props.meta.image && <meta name='image' content={props.baseDomain + props.meta.image} />}
      {props.meta.image && <meta property='og:image' content={props.baseDomain + props.meta.image} />}
      {props.meta.keywords && props.meta.keywords.length > 0 &&
      <meta name='keywords' content={props.meta.keywords && props.meta.keywords.join()} />}
      {props.meta.faviconUrl && <link rel='shortcut icon' type='image/png' href={props.meta.faviconUrl} />}
    </Helmet>
  )
}

export const LoginRequired = (render: (props: RouteComponentProps<any>) => React.ReactNode, isAuthenticated: () => boolean, onNotAuthenticated: () => void) => {
  return (props: RouteComponentProps<any>) => {
    if (isAuthenticated()) {
      return render(props)
    }
    onNotAuthenticated()
    return undefined
  }
}

export const IsExternal = (pathOrUrl: string) => {
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


export const NavLink = withRouter((
  props: {
    to: string,
    linkProps?: React.ComponentProps<any>
    render: (active: boolean, currentPath?: string) => React.ReactNode | undefined
    beforeGo?: () => void
  } & RouteComponentProps
) => {
  const { external, target } = IsExternal(props.to)
  const isActive =
    !external &&
    matchPath(props.history.location.pathname, {
      path: props.to,
      exact: true
    }) != null
  return (
    <link
      href={props.to}
      target={target}
      {...props.linkProps}
      onClick={(e: any) => {
        if (!external) {
          e.preventDefault()
          props.beforeGo && props.beforeGo()
          props.history.push(props.to)
        }
      }}
    >
      {props.render(isActive, props.history.location.pathname)}
    </link>
  )
})

export const Router = (props: { routes: RouteSet, notFound: any, isAuthenticated: () => boolean, onNotAuthenticated: () => void, baseDomain: string }) => {
  return (
    <QueryParamProvider ReactRouterRoute={Route}>
      <Switch>
        {Object.entries(props.routes).map(([routeName, routeProps]) => {
          return (
            <Route
              key={routeName}
              exact
              path={routeProps.path}
              render={(innerProps) => (
                <>
                  <MetaDataToHelmet meta={routeProps.meta} baseDomain={props.baseDomain} />
                  {routeProps.loginRequired
                    ? LoginRequired(routeProps.makeComponent, props.isAuthenticated, props.onNotAuthenticated)(innerProps)
                    : routeProps.makeComponent(innerProps)
                  }
                </>
              )}
            />
          )
        })}
        <Route component={props.notFound} />
      </Switch>
    </QueryParamProvider>
  )
}
