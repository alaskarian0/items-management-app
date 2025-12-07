import Layouts from "@/components/layouts";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layouts>
      {children}
    </Layouts>
  );
}
