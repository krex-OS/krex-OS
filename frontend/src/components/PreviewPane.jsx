import React, { useEffect, useRef } from 'react';

export default function PreviewPane({ html }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(html || '<!doctype html><html><body><p>Nothing to preview yet.</p></body></html>');
    doc.close();
  }, [html]);

  return (
    <iframe ref={iframeRef} title="Live Preview" className="w-full h-full bg-white rounded" />
  );
}