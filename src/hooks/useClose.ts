import { useEffect } from 'react';

interface UseCloseProps {
  ref: React.MutableRefObject<HTMLElement | null>;
  fn: () => void;
}

const useClose = ({ ref, fn }: UseCloseProps): void => {
  useEffect(() => {
    if (ref !== null) return;

    function handleClick(event: MouseEvent): void {
      if (ref.current != null && !ref.current.contains(event.target as Node)) {
        fn();
      }
    }
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [ref]); // eslint-disable-line
};

export default useClose;
