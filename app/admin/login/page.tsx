import { adminConfigured } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Only send people back to admin pages after signing in.
  const target = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  return (
    <div className="a-login">
      <div className="a-login-card">
        <div>
          <div className="a-login-brand">GAE</div>
          <p className="a-muted">Sign in to edit the website.</p>
        </div>
        {adminConfigured() ? (
          <LoginForm next={target} />
        ) : (
          <div className="a-notice error">
            Sign-in is not set up yet. Add <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> to the environment
            variables (in <code>.env.local</code> on your computer, or in Vercel → Settings → Environment Variables),
            then restart or redeploy.
          </div>
        )}
      </div>
    </div>
  );
}
