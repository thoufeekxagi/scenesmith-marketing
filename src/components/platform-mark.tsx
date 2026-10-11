type Platform = "instagram" | "x" | "linkedin";

export function PlatformMark({platform, className = ""}: {platform: Platform; className?: string}) {
  if (platform === "instagram") {
    return <svg className={`platform-mark ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>;
  }

  if (platform === "linkedin") {
    return <svg className={`platform-mark ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M5.1 8.3H2.2V21h2.9V8.3ZM3.65 3A1.7 1.7 0 1 0 3.65 6.4 1.7 1.7 0 0 0 3.65 3ZM8.3 8.3H11V10h.05c.38-.72 1.33-1.96 3.65-1.96 3.9 0 4.62 2.57 4.62 5.91V21h-2.9v-6.27c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.33V21H8.3V8.3Z" />
    </svg>;
  }

  return <svg className={`platform-mark ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.45 22H3.34l7.24-8.28L3 2h6.4l4.43 5.86L18.9 2Zm-1.1 17.8h1.73L8.48 4.08H6.62L17.8 19.8Z" />
  </svg>;
}
