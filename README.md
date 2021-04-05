# Routes on Steroids

## Install
```shell
npm install @synth-tech/routes
```

## Example: Todos List 

```typescript jsx
import { Metadata, RouteParams, Router } from "@synth-tech/routes"
import { BrowserRouter, RouteComponentProps } from "react-router-dom"

const todosLogo = require('/somestaticpath')

const defaultMetaData: Metadata = {
  title: "List of Todos",
  description: "List of todos",
  keywords: ["todos", "todos-list"],
  image: todosLogo,
  faviconUrl: todosLogo
}

export const routes = {
  TodosList: {
    meta: {
      ...defaultMetaDatam
    },
    path: "/todos/",
    makePath: () => "/todos",
    loginRequired: true,
    makeComponent: () => {
      return <Todos />
    },
  } as RouteParams,
  Todo: {
    meta: {
      ...defaultMetaData,
    },
    path: "/todos/:id",
    makePath: (id: string) => `/todos/${id}`,
    loginRequired: true,
    makeComponent: (props: RouteComponentProps<{ id: string }>) => {
      return <Todo id={props.match.params.id} />
    }
  } as RouteParams
}

export const App = () => {
  return (
    <BrowserRouter>
      <Router
        baseDomain={"https://mydomain.com"}
        routes={routes}
        isAuthenticated={() => true } // your authenticated func
        notFound={<NotFoundComponent />}
        onNotAuthenticated={() => {
          window.location.href = "/" 
        }}
      />
    </BrowserRouter>
  )
}

```

