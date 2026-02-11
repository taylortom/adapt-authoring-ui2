import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import FormPage from './pages/FormPage'
import ContentPluginsPage from './pages/ContentPluginsPage'
import ProjectsPage from './pages/ProjectsPage'

const routes = [
  { path: '/', element: <HomePage />, label: 'app.home', nav: true },
  { path: '/about', element: <AboutPage />, label: 'app.about', nav: true },
  { path: '/form', element: <FormPage />, label: 'app.form', nav: true },
  { path: '/contentplugins', element: <ContentPluginsPage />, label: 'app.plugins', nav: true },
  { path: '/projects', element: <ProjectsPage />, label: 'app.projects', nav: true }
]

export default routes
