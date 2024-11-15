import { useRef, useEffect } from "react";

export const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return ref;
};
