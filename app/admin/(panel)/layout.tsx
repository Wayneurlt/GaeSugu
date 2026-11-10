import AdminNav from "@/components/admin/AdminNav";
import { storageInfo } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const storage = storageInfo();
  return (
    <div className="a-shell">
      <AdminNav email={process.env.ADMIN_EMAIL?.trim() || "admin"} />
      <div className="a-main">
        {!storage.ready && <div className="a-notice error">{storage.problem}</div>}
        {children}
      </div>
    </div>
  );
}
