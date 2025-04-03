export const DataApp = () => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lightning bolt - main energy symbol */}
        <path 
          d="M13 2L4 14H11L10 22L19 9H12L13 2Z" 
          fill="#1E1E2D"
        />
        
        {/* Optional energy waves */}
        <path 
          d="M8 7C6.5 7 5.5 8 4 8" 
          stroke="#1E1E2D" 
          strokeWidth="1.2" 
          strokeLinecap="round"
          opacity="0.6"
        />
        <path 
          d="M20 16C18.5 16 17.5 17 16 17" 
          stroke="#1E1E2D" 
          strokeWidth="1.2" 
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    );
  };