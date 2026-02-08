# Assets Directory

This directory contains static assets that are processed and bundled by Vite.

## Structure

- **images/** - Images, logos, illustrations (PNG, JPG, SVG, WebP)
- **fonts/** - Custom web fonts (WOFF, WOFF2, TTF)
- **icons/** - SVG icons used in components

## Usage

Import assets in your components:

```javascript
import logo from './assets/images/logo.svg'
import customFont from './assets/fonts/custom-font.woff2'

function MyComponent() {
  return <img src={logo} alt="Logo" />
}
```

## Build Process

- Vite will optimize and hash these files during build
- Small images (<4KB) may be inlined as base64
- Larger files will be copied to `dist/assets/` with content hashes

## Note

For files that should NOT be processed (favicon, robots.txt, etc.), use the `public/` directory instead.
