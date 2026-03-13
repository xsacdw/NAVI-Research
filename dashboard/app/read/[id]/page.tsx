import { sessions } from "@/lib/data";
import { ReadClient } from "@/components/read-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  return <ReadClient id={id} />;
}

export function generateStaticParams() {
  return sessions.map((s) => ({ id: s.id }));
}
