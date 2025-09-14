// FYI - importing '~react-pages' was working...but still showing IDE error without this...
declare module '~react-pages' {
   import type { RouteObject } from 'react-router-dom'
   const routes: RouteObject[]
   export default routes
}