/* oxlint-disable typescript-eslint/explicit-module-boundary-types, unicorn/filename-case */
const SvgArrow = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={51}
    height={12}
    className={className}
  >
    <path d="M1 5H0v2h1zm50 1L41 .226v11.548zM1 7h41V5H1z" />
  </svg>
);

export default SvgArrow;
