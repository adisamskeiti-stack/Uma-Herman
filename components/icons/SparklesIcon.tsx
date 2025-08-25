
import React from 'react';

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.93 2.53a2.5 2.5 0 0 1 4.14 0l.23.35a1 1 0 0 0 .88.52h.44a2.5 2.5 0 0 1 2.5 2.5v.44c0 .34.2.65.52.88l.35.23a2.5 2.5 0 0 1 0 4.14l-.35.23a1 1 0 0 0-.52.88v.44a2.5 2.5 0 0 1-2.5 2.5h-.44a1 1 0 0 0-.88.52l-.23.35a2.5 2.5 0 0 1-4.14 0l-.23-.35a1 1 0 0 0-.88-.52h-.44a2.5 2.5 0 0 1-2.5-2.5v-.44a1 1 0 0 0-.52-.88l-.35-.23a2.5 2.5 0 0 1 0-4.14l.35-.23a1 1 0 0 0 .52-.88v-.44a2.5 2.5 0 0 1 2.5-2.5h.44c.34 0 .65-.2.88-.52l.23-.35Z" />
    <path d="M12 8v8" />
    <path d="M8.5 14.5 12 12l3.5 2.5" />
    <path d="m12 12 3.5-2.5L12 7 8.5 9.5 12 12Z" />
  </svg>
);

export default SparklesIcon;
