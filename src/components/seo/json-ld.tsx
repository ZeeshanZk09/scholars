type JsonLdProps = {
  data: Record<string, unknown>;
};

function toJson(data: Record<string, unknown>): string {
  return JSON.stringify(data).replaceAll(/</g, "\\u003c");
}

export function JsonLd({ data }: Readonly<JsonLdProps>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJson(data) }} />;
}
