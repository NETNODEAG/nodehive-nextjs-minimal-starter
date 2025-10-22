'use client';

type IframeWrapperProps = {
  children: React.ReactNode;
};

export default function IframeWrapper({ children }: IframeWrapperProps) {
  const isInIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  if (!isInIframe) {
    return children;
  }

  return (
    <div className="outline-primary-700 rounded-lg p-2 hover:outline-2 hover:-outline-offset-2 hover:outline-dashed">
      {children}
    </div>
  );
}
