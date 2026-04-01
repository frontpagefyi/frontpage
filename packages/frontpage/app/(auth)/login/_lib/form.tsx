"use client";

import { startTransition, useActionState, useState } from "react";
import { loginWithIdentifierAction, loginWithPdsAction } from "./action";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { type ErrorReason } from "@/lib/auth-sign-in";

const DEFAULT_PDS = process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST
  ? {
      host: process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST,
      label: process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST,
    }
  : {
      host: "bsky.social",
      label: "Bluesky",
    };

// ─── shared Win2k styles ────────────────────────────────────────────────────

const win2kInput: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontSize: "11px",
  background: "#ffffff",
  color: "#000000",
  border: "1px solid",
  borderColor: "#808080 #ffffff #ffffff #808080",
  padding: "2px 4px",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const win2kButton: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontSize: "11px",
  background: "#d4d0c8",
  color: "#000000",
  border: "2px solid",
  borderColor: "#ffffff #808080 #808080 #ffffff",
  padding: "3px 12px",
  cursor: "default",
  minWidth: "75px",
  width: "100%",
  textAlign: "center",
  boxSizing: "border-box",
};

const win2kButtonActive: React.CSSProperties = {
  ...win2kButton,
  borderColor: "#808080 #ffffff #ffffff #808080",
};

const win2kButtonDisabled: React.CSSProperties = {
  ...win2kButton,
  color: "#808080",
  cursor: "default",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontSize: "11px",
  color: "#000000",
  display: "block",
  marginBottom: "2px",
};

// ─── components ─────────────────────────────────────────────────────────────

function Win2kGroupBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      style={{
        border: "1px solid",
        borderColor: "#808080 #ffffff #ffffff #808080",
        padding: "8px 8px 8px 8px",
        marginTop: "4px",
        background: "#d4d0c8",
      }}
    >
      <legend
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          color: "#000000",
          padding: "0 4px",
        }}
      >
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function LoginError({
  error,
  children,
}: {
  error: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      style={{
        border: "1px solid",
        borderColor: "#808080 #ffffff #ffffff #808080",
        background: "#fff8f8",
        padding: "6px",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        display: "flex",
        gap: "6px",
        alignItems: "flex-start",
        marginTop: "4px",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "1px" }}>
        <circle cx="8" cy="8" r="7" fill="#cc0000" stroke="#990000" />
        <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
      </svg>
      <div>
        <div style={{ fontWeight: "bold", color: "#cc0000" }}>{error ?? "Login error"}</div>
        <div style={{ color: "#333333" }}>
          {children ?? "Please try again or use a different login method."}
        </div>
      </div>
    </div>
  );
}

function IdentifierForm() {
  const [identifierState, identifierAction, isIdentifierPending] =
    useActionState(loginWithIdentifierAction, null);
  const [active, setActive] = useState(false);

  return (
    <form
      action={identifierAction}
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => {
          identifierAction(new FormData(event.currentTarget));
        });
      }}
    >
      <Win2kGroupBox title="Internet Handle">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="identifier" style={labelStyle}>
            Enter your internet handle:
          </label>
          <input
            id="identifier"
            name="identifier"
            required
            placeholder="eg. dril.bsky.social"
            aria-label="Internet handle"
            style={win2kInput}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={isIdentifierPending}
              style={
                isIdentifierPending
                  ? win2kButtonDisabled
                  : active
                  ? win2kButtonActive
                  : win2kButton
              }
              onMouseDown={() => setActive(true)}
              onMouseUp={() => setActive(false)}
              onMouseLeave={() => setActive(false)}
            >
              {isIdentifierPending ? "Please wait..." : "Login →"}
            </button>
          </div>
          {identifierState?.error ? (
            <IdentifierFormError reason={identifierState.error} />
          ) : null}
        </div>
      </Win2kGroupBox>
    </form>
  );
}

function IdentifierFormError({ reason }: { reason: ErrorReason }) {
  if (reason === "DID_NOT_FOUND") {
    return (
      <LoginError error="Internet handle not found">
        <p>
          There was either a typo in your internet handle or a temporary issue
          with the service.
        </p>
      </LoginError>
    );
  }

  if (reason === "PDS_NOT_FOUND") {
    return (
      <LoginError error="PDS not found">
        <p>
          The Personal Data Server (PDS) hosting your internet handle is either
          temporarily down or there is a network issue.
        </p>
      </LoginError>
    );
  }

  return (
    <LoginError error="Login error">
      <p>An unexpected error occurred. Please try again later.</p>
      <p>Error code: {reason}</p>
    </LoginError>
  );
}

function DefaultPdsSignupButton() {
  const [pdsState, pdsAction, isPdsPending] = useActionState(
    loginWithPdsAction,
    null,
  );
  const [active, setActive] = useState(false);

  return (
    <form action={pdsAction}>
      <button
        type="submit"
        disabled={isPdsPending}
        name="pdsUrl"
        value={`https://${DEFAULT_PDS.host}`}
        style={
          isPdsPending
            ? win2kButtonDisabled
            : active
            ? win2kButtonActive
            : win2kButton
        }
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onMouseLeave={() => setActive(false)}
      >
        {isPdsPending ? "Please wait..." : `Sign up with ${DEFAULT_PDS.label}`}
      </button>
      {pdsState?.error ? <LoginError error={pdsState?.error} /> : null}
    </form>
  );
}

function PdsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [pdsState, pdsAction, isPdsPending] = useActionState(
    loginWithPdsAction,
    null,
  );
  const [active, setActive] = useState(false);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pds-dialog-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#d4d0c8",
          border: "2px solid",
          borderColor: "#ffffff #808080 #808080 #ffffff",
          width: "320px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Dialog title bar */}
        <div
          style={{
            background: "linear-gradient(to right, #000080, #1084d0)",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 4px",
          }}
        >
          <span id="pds-dialog-title" style={{ color: "#ffffff", fontSize: "11px", fontWeight: "bold" }}>
            Login with PDS
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: "16px",
              height: "14px",
              fontSize: "10px",
              background: "#d4d0c8",
              border: "1px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              cursor: "default",
              fontFamily: "Arial, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>

        {/* Dialog body */}
        <div style={{ padding: "12px" }}>
          <p style={{ fontSize: "11px", marginBottom: "8px", color: "#000000" }}>
            Enter the URL of your PDS to login or sign up. By continuing, you
            accept the Terms of Service of your chosen PDS.
          </p>
          <form
            action={pdsAction}
            onSubmit={(event) => {
              event.preventDefault();
              startTransition(() => {
                pdsAction(new FormData(event.currentTarget));
              });
            }}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <label htmlFor="pdsUrl" style={labelStyle}>
              PDS host:
            </label>
            <input
              id="pdsUrl"
              name="pdsUrl"
              placeholder="eg. bsky.social"
              defaultValue={DEFAULT_PDS.host}
              aria-label="Personal Data Server host"
              style={win2kInput}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={onClose}
                style={win2kButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPdsPending}
                style={
                  isPdsPending
                    ? win2kButtonDisabled
                    : active
                    ? win2kButtonActive
                    : win2kButton
                }
                onMouseDown={() => setActive(true)}
                onMouseUp={() => setActive(false)}
                onMouseLeave={() => setActive(false)}
              >
                {isPdsPending ? "Please wait..." : "Continue"}
              </button>
            </div>
            {pdsState?.error ? <LoginError error={pdsState?.error} /> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

function HelpAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  const items = [
    {
      id: "internet-handle-help",
      question: "What is an internet handle?",
      answer: (
        <>
          <p>
            Some open social apps, such as Bluesky, set you up with a free
            domain and open social hosting when you sign up. You might not have
            realized that, but if you sign up on one of those services, the
            username you get is a domain, such as you.bsky.social. That&apos;s
            an internet handle.
          </p>
          <p>
            If you don&apos;t have one, choose &quot;Continue with your
            PDS&quot; and select a service to login or sign up.
          </p>
          <p>
            Read more at{" "}
            <a
              href="https://internethandle.org"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#0000cc" }}
            >
              internethandle.org <OpenInNewWindowIcon className="inline" />
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "pds-help",
      question: "What is my PDS?",
      answer: (
        <>
          <p>
            Your Personal Data Server (PDS) is a service that stores your
            social data and allows you to interact with open social apps on AT
            Protocol.
          </p>
          <p>
            If you don&apos;t have a specific PDS, it&apos;s best to continue
            with Bluesky using the button above. You can always move to a
            different PDS later.
          </p>
        </>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "4px" }}>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: "2px" }}>
          <button
            type="button"
            onClick={() => setOpen(open === item.id ? null : item.id)}
            style={{
              width: "100%",
              textAlign: "left",
              fontFamily: "Arial, sans-serif",
              fontSize: "11px",
              background: "#d4d0c8",
              border: "1px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "2px 6px",
              cursor: "default",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#000000",
            }}
            aria-expanded={open === item.id}
          >
            <span style={{ fontSize: "9px", display: "inline-block", width: "8px" }}>
              {open === item.id ? "▼" : "▶"}
            </span>
            {item.question}
          </button>
          {open === item.id && (
            <div
              style={{
                border: "1px solid",
                borderColor: "#808080 #ffffff #ffffff #808080",
                borderTop: "none",
                padding: "6px 8px",
                background: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                color: "#000000",
                lineHeight: "1.5",
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function LoginForm() {
  const [pdsDialogOpen, setPdsDialogOpen] = useState(false);
  const [signupActive, setSignupActive] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <IdentifierForm />

      {/* Horizontal rule */}
      <div
        style={{
          borderTop: "1px solid #808080",
          borderBottom: "1px solid #ffffff",
          margin: "2px 0",
        }}
      />

      <DefaultPdsSignupButton />

      <button
        type="button"
        onClick={() => setPdsDialogOpen(true)}
        style={
          signupActive
            ? win2kButtonActive
            : win2kButton
        }
        onMouseDown={() => setSignupActive(true)}
        onMouseUp={() => setSignupActive(false)}
        onMouseLeave={() => setSignupActive(false)}
      >
        Sign up with a PDS
      </button>

      <HelpAccordion />

      <PdsDialog open={pdsDialogOpen} onClose={() => setPdsDialogOpen(false)} />
    </div>
  );
}
