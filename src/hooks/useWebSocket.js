import { useEffect } from 'react'
import { socket } from '../services/websocket'

/**
 * Custom hook for listening to WebSocket events
 * @param {string} event - The event name to listen to
 * @param {Function} callback - The callback function (should be memoized with useCallback)
 *
 * Note: Callback should be wrapped in useCallback to prevent unnecessary re-registrations
 */
export const useWebSocket = (event, callback) => {
  useEffect(() => {
    socket.on(event, callback)
    return () => socket.off(event, callback)
  }, [event, callback])
}
