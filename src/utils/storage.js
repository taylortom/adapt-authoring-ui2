// Always store structured JSON, never raw HTML
export const storeContent = (content) => {
  if (typeof content === 'string') {
    console.warn('String content detected. Convert to structured JSON.')
  }
  return JSON.stringify(content)
}

export const retrieveContent = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('Invalid JSON content:', e)
    return null
  }
}
