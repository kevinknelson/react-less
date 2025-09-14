import { useRoutes } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import DefaultTemplate from './components/templates/DefaultTemplate'
import routes from '~react-pages'

// Layout mapping
const layouts = {
  default: DefaultTemplate,
} as const

type TemplateName = keyof typeof layouts

interface AppRouteMeta {
  layout?: TemplateName
}

type AppRouteObject = RouteObject & {
  meta?: AppRouteMeta
  children?: AppRouteObject[]
}

// 🔁 Recursively apply layout
function applyLayout(route: AppRouteObject): RouteObject {
    const layoutName = route.meta?.layout || 'default'
    const Layout = layouts[layoutName]

    const wrappedRoute: RouteObject = {
        ...route,
        element: route.element ? <Layout>{route.element}</Layout> : undefined,
    }

    if (route.children) {
        wrappedRoute.children = route.children.map(applyLayout)
    }

    return wrappedRoute
}


const App = () => {
  const routed = useRoutes((routes as AppRouteObject[]).map(applyLayout))
  return routed
}

export default App
