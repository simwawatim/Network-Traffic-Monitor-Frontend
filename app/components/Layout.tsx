// app/insight-details/layout.tsx  (or whatever your route group folder is)
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}