interface OfflineNoticeProps {
  className?: string;
}

export function OfflineNotice({ className = "" }: OfflineNoticeProps) {
  return (
    <div
      role="alert"
      className={`border-b border-amber-500/30 bg-amber-950/90 px-4 py-3 text-center text-sm leading-relaxed text-amber-100 ${className}`.trim()}
    >
      <p className="font-medium">اتصال به سرور برقرار نیست</p>
      <p className="mt-0.5 text-xs text-amber-200/80">
        در حال نمایش داده‌های آفلاین (نمونه)
      </p>
    </div>
  );
}
