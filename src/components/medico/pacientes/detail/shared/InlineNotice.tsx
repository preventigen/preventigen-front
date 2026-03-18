interface InlineNoticeProps {
  message: string;
}

export function InlineNotice({ message }: InlineNoticeProps) {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
      {message}
    </p>
  );
}
