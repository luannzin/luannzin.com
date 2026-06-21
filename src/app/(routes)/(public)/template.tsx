export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="animate-in fade-in-0 blur-in-xs animation-duration-250">
      {children}
    </main>
  );
}
