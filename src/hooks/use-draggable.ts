import { useState, useRef, useEffect, useCallback, RefObject } from 'react';

export interface DraggablePosition {
  x: number;
  y: number;
}

export interface UseDraggableOptions {
  elementId: string;
  isEditMode: boolean;
  onPositionChange?: (position: DraggablePosition) => void;
  initialPosition?: DraggablePosition;
}

export function useDraggableElement(options: UseDraggableOptions) {
  const { elementId, isEditMode, onPositionChange, initialPosition } = options;
  const [position, setPosition] = useState<DraggablePosition>(
    initialPosition || { x: 0, y: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`element-position-${elementId}`);
    if (saved) {
      try {
        const restored = JSON.parse(saved);
        setPosition(restored);
        onPositionChange?.(restored);
      } catch (e) {
        console.error('Failed to restore element position:', e);
      }
    }
  }, [elementId, onPositionChange]);

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`element-position-${elementId}`, JSON.stringify(position));
  }, [position, elementId]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditMode) return;

      setIsDragging(true);
      startPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [isEditMode, position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - startPos.current.x;
      const newY = e.clientY - startPos.current.y;

      setPosition({ x: newX, y: newY });
      onPositionChange?.({ x: newX, y: newY });
    },
    [isDragging, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    position,
    setPosition,
    isDragging,
    handleMouseDown,
    elementRef,
  };
}

export function useSaveLayout(editMode: boolean) {
  const saveLayout = useCallback(() => {
    if (!editMode) return;

    // Collect all element positions
    const elements = document.querySelectorAll('[data-draggable-id]');
    const layout: Record<string, DraggablePosition> = {};

    elements.forEach((el) => {
      const id = el.getAttribute('data-draggable-id');
      if (id) {
        const rect = el.getBoundingClientRect();
        layout[id] = {
          x: rect.left,
          y: rect.top,
        };
      }
    });

    localStorage.setItem('page-layout', JSON.stringify(layout));
    console.log('✅ Layout saved:', layout);

    return layout;
  }, [editMode]);

  return { saveLayout };
}
