export default function Debug({
  data,
  title = 'Debug Output',
}: {
  data: any;
  title?: string;
}) {
  return (
    <details className="container mx-auto mt-10 mb-10 rounded-md bg-black p-4 text-xs text-slate-50">
      <summary className="cursor-pointer font-bold">{title}</summary>
      <pre className="mt-8">{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}
