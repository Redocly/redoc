import { useEffect } from 'react';

/**
 * Hook that fires event on clicks outside of the passed ref
 */
export function useOutsideKeypress(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener('keypress', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('keypress', handleClickOutside);
    };
  }, [ref, callback]);
}
