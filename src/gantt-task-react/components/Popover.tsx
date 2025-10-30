import React, { useEffect, useRef, useState } from "react";

type PopoverProps = {
  left: number;
  top: number;
  children: React.ReactNode;
};

export function Popover({ left, top, children }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState({ left, top });

  useEffect(() => {
    if (popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();

      // 실제 크기로 위치 재조정
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newLeft = left;
      let newTop = top;

      // 오른쪽 경계 체크
      if (left + rect.width > viewportWidth) {
        newLeft = viewportWidth - rect.width - 10;
      }

      // 하단 경계 체크
      if (top + rect.height > viewportHeight) {
        newTop = viewportHeight - rect.height - 10;
      }

      // 왼쪽 경계 체크
      if (newLeft < 10) {
        newLeft = 10;
      }

      // 상단 경계 체크
      if (newTop < 10) {
        newTop = 10;
      }

      setAdjustedPosition({ left: newLeft, top: newTop });
    }
  }, [left, top]);

  return (
    <div
      ref={popoverRef}
      className="gantt-popover"
      style={{
        position: "fixed",
        left: adjustedPosition.left,
        top: adjustedPosition.top,
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
