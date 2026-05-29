type ClientPagePlaceholderProps = {
  title: string;
  description?: string;
};

export function ClientPagePlaceholder({ title, description }: ClientPagePlaceholderProps) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </main>
  );
}
