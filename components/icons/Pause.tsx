const SvgPause = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    className={className}
    fill="none"
    viewBox="0 0 16 16"
  >
    <path d="M7 1H2v14h5zM14 1H9v14h5z" />
  </svg>
);

export default SvgPause;
