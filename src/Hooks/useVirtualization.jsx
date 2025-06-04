import { useMemo } from 'react';

const useVirtualization = (items, containerHeight, itemHeight) => {
  const virtualizedData = useMemo(() => {
    const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
    const bufferSize = Math.max(5, Math.ceil(visibleItemsCount * 0.5));
    
    return {
      visibleItemsCount,
      bufferSize,
      totalHeight: items.length * itemHeight
    };
  }, [items.length, containerHeight, itemHeight]);

  return virtualizedData;
};

export default useVirtualization;
