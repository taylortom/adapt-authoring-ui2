import About from './pages/About'
import Assets from './pages/Assets'
import ContentPlugins from './pages/ContentPlugins'
import Login from './pages/Login'
import Project from './pages/Project'
import Projects from './pages/Projects'
import Users from './pages/Users'

const RouteConfig = {
  Home: { path: '/', element: <Projects />, label: 'app.projects' },
  Login: { path: '/login', element: <Login />, protected: false, nav: false },
  About: { path: '/about', element: <About />, label: 'app.about' },
  Assets: { path: '/assets', element: <Assets />, label: 'app.assets' },
  Plugins: { path: '/contentplugins', element: <ContentPlugins />, label: 'app.plugins' },
  Users: { path: '/users', element: <Users />, label: 'app.users' },
  Project: { path: '/project/:id', element: <Project />, nav: false }
}

export function filterRoutes (filterFunc) {
  return Object.values(RouteConfig)
    .map(r => Object.assign({ protected: true, nav: true }, r)) // add some default values
    .filter(filterFunc)
}
export default RouteConfig
