import { redirect } from "next/navigation";
import { LoginForm } from "./_lib/form";
import { getUser } from "@/lib/data/user";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getUser();

  if (user !== null) {
    redirect("/");
  }

  const error = (await searchParams).error;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Inset panel header with logo area */}
      <div
        className="flex items-center gap-3 mb-4 p-3"
        style={{
          border: "1px solid",
          borderColor: "#808080 #ffffff #ffffff #808080",
          background: "#ffffff",
        }}
      >
        {/* Retro globe/compass icon */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #000080 0%, #1084d0 100%)",
            border: "1px solid #808080",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="12" stroke="#87ceeb" strokeWidth="1.5" fill="none" />
            <ellipse cx="16" cy="16" rx="6" ry="12" stroke="#87ceeb" strokeWidth="1" fill="none" />
            <line x1="4" y1="16" x2="28" y2="16" stroke="#87ceeb" strokeWidth="1" />
            <line x1="16" y1="4" x2="16" y2="28" stroke="#87ceeb" strokeWidth="1" />
            <circle cx="16" cy="16" r="2" fill="#ffffff" />
          </svg>
        </div>
        <div>
          <div
            style={{ fontSize: "16px", fontWeight: "bold", color: "#000080", fontFamily: "Arial, sans-serif" }}
          >
            Frontpage
          </div>
          <div
            style={{ fontSize: "11px", color: "#444444", fontFamily: "Arial, sans-serif" }}
          >
            Sign in to your Frontpage account
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mb-3"
        style={{
          borderTop: "1px solid #808080",
          borderBottom: "1px solid #ffffff",
        }}
      />

      {/* Description text */}
      <p
        className="mb-3"
        style={{ fontSize: "11px", color: "#000000", fontFamily: "Arial, sans-serif" }}
      >
        Please enter your internet handle or select a sign-in option below. By
        continuing, you agree to the Terms of Service.
      </p>

      <LoginForm />

      {error ? (
        <div
          className="mt-3 flex items-start gap-2 p-2"
          style={{
            border: "1px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
            background: "#fff8f8",
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
          }}
          role="alert"
        >
          {/* Error icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
            <circle cx="8" cy="8" r="7" fill="#cc0000" stroke="#990000" />
            <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
          </svg>
          <div>
            <div style={{ fontWeight: "bold", color: "#cc0000" }}>Login error, please try again</div>
            <div style={{ color: "#333333" }}>{error}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
