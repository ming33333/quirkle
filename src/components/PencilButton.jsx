export default function PencilButton({
  className = "",
  label = "Edit title",
  onClick,
}) {
  return (
    <button
      aria-label={label}
      className={`pencil-button ${className}`.trim()}
      onClick={onClick}
      type="button"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.5 19.5h3.1L19 8.1 15.9 5 4.5 16.4v3.1z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M13.7 7.2 16.8 10.3"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    </button>
  );
}
