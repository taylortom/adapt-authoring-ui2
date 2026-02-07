import DOMPurify from 'dompurify'

export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'u'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}
