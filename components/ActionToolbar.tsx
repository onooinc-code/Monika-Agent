import React from 'react';

const AttachmentIconV2 = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
      />
    </svg>
  );
  const GridIcon = () => (
    <svg
      viewBox="0 0 24 24"
      height={20}
      width={20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
  const GlobeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      height={20}
      width={20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667"
        fill="currentColor"
      />
    </svg>
  );

interface ActionToolbarProps {
  onAttachClick: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ onAttachClick }) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onAttachClick} className="message-input-actions-btn" title="Attach an image">
        <AttachmentIconV2 />
      </button>
      <button className="message-input-actions-btn" title="Add template">
        <GridIcon />
      </button>
      <button className="message-input-actions-btn" title="Browse web">
        <GlobeIcon />
      </button>
    </div>
  );
};
