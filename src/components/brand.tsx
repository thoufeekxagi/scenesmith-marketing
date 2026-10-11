type BrandProps = {
  variant?: "light" | "dark";
  markOnly?: boolean;
  className?: string;
};

const palette = {
  light: {tile: "#183C2B", mark: "#F5F7F6", word: "#16211E"},
  dark: {tile: "#0F1614", mark: "#2FA890", word: "#F1F5F3"}
} as const;

export function SceneSmithBrand({variant = "light", markOnly = false, className}: BrandProps) {
  const colors = palette[variant];
  const viewBox = markOnly ? "0 0 96 96" : "0 0 340 96";
  return (
    <svg
      aria-label="SceneSmith"
      className={className}
      role="img"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="96" height="96" rx="20" fill={colors.tile} />
      <path d="M48 22L74 48L48 74L22 48Z M47 37V59L62 48Z" fillRule="evenodd" fill={colors.mark} />
      {!markOnly && (
        <text x="128" y="63" fill={colors.word} fontFamily="Georgia, Times New Roman, serif" fontSize="38">
          <tspan fontWeight="300">scene</tspan>
          <tspan fontWeight="700">smith</tspan>
        </text>
      )}
    </svg>
  );
}
