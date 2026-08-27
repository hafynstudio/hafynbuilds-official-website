interface JsonLdProps {
  id: string;
  data: unknown;
}

/**
 * Server-rendered JSON-LD only. This component deliberately has no
 * "use client" boundary so schema adds no client-side JavaScript cost.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
