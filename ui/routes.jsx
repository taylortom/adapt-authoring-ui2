import Home from './pages/Home'
import About from './pages/About'
import Form from './pages/Form'
import ContentPlugins from './pages/ContentPlugins'
import Projects from './pages/Projects'

const routes = [
  { path: '/', element: <Home />, label: 'app.home', nav: true },
  { path: '/about', element: <About />, label: 'app.about', nav: true },
  { path: '/form', element: <Form />, label: 'app.form', nav: true },
  { path: '/contentplugins', element: <ContentPlugins />, label: 'app.plugins', nav: true },
  { path: '/projects', element: <Projects />, label: 'app.projects', nav: true }
]

export default routes
