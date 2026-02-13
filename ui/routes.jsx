import About from './pages/About'
import ContentPlugins from './pages/ContentPlugins'
import Login from './pages/Login'
import Project from './pages/Project'
import Projects from './pages/Projects'

const RouteConfig = {
  Home: { path: '/', element: <Projects />, label: 'app.projects' },
  Login: { path: '/login', element: <Login />, protected: false, nav: false },
  About: { path: '/about', element: <About />, label: 'app.about' },
  Plugins: { path: '/contentplugins', element: <ContentPlugins />, label: 'app.plugins' },
  Project: { path: '/project/:id', element: <Project />, nav: false }
}

export function filterRoutes (filterFunc) {
  return Object.values(RouteConfig)
    .map(r => Object.assign({ protected: true, nav: true }, r)) // add some default values
    .filter(filterFunc)
} 
export default RouteConfig