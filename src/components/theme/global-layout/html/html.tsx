export default async function HTML({
  children,
  langPromise,
}: {
  children: React.ReactNode;
  langPromise: Promise<string>;
}) {
  const lang = await langPromise;
  return <html lang={lang}>{children}</html>;
}
