"use client";

import { startTransition, useActionState, useState } from "react";
import { loginWithIdentifierAction, loginWithPdsAction } from "./action";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert";
import { CrossCircledIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";

import { Field } from "@/lib/components/ui/field";
import { Separator } from "@/lib/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { type ErrorReason } from "@/lib/auth-sign-in";

const DEFAULT_PDS_URL =
  process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST || "bsky.social";

export function LoginForm() {
  const [pdsDialogOpen, setPdsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <IdentifierForm />

      <Separator />

      <Dialog open={pdsDialogOpen} onOpenChange={setPdsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            Continue with PDS
          </Button>
        </DialogTrigger>
        <DialogContent className="top-1/3">
          <DialogHeader>
            <DialogTitle>Login with PDS</DialogTitle>
            <DialogDescription>
              Enter the URL of your PDS to login or signup. By continuing, you
              accept the Terms of Service of your chosen PDS.
            </DialogDescription>
          </DialogHeader>

          <PdsForm />
        </DialogContent>
      </Dialog>

      <Accordion type="multiple">
        <AccordionItem value="internet-handle-help">
          <AccordionTrigger>What is an internet handle?</AccordionTrigger>
          <AccordionContent className="text-pretty prose prose-sm">
            <p>
              Some open social apps, such as Bluesky, set you up with a free
              domain and open social hosting when you sign up. You might not
              have realized that, but if you sign up on one of those services,
              the username you get is a domain, such as you.bsky.social.
              That&apos;s an internet handle.
            </p>
            <p>
              If you don&apos;t have one, choose &quot;Continue with your
              PDS&quot; and select a service to login or signup.
            </p>
            <p>
              Read more at{" "}
              <a
                href="https://internethandle.org"
                target="_blank"
                rel="noreferrer"
              >
                internethandle.org <OpenInNewWindowIcon className="inline" />
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pds-help">
          <AccordionTrigger>What is my PDS?</AccordionTrigger>
          <AccordionContent className="text-pretty prose prose-sm">
            <p>
              Your Personal Data Server (PDS) is a service that stores your
              social data and allows you to interact with open social apps on AT
              Protocol.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
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
    <div>
      <Alert variant="destructive">
        <CrossCircledIcon className="h-4 w-4" />
        <AlertTitle>{error ?? "Login error"}</AlertTitle>

        <AlertDescription>
          {children ?? "Please try again or use a different login method."}
        </AlertDescription>
      </Alert>
    </div>
  );
}

function IdentifierForm() {
  const [identifierState, identifierAction, isIdentifierPending] =
    useActionState(loginWithIdentifierAction, null);

  return (
    <form
      className="flex flex-col gap-2"
      action={identifierAction}
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => {
          identifierAction(new FormData(event.currentTarget));
        });
      }}
    >
      <Field>
        <Input
          id="identifier"
          name="identifier"
          required
          placeholder="eg. dril.bsky.social"
        />
      </Field>
      <Button type="submit" disabled={isIdentifierPending} className="w-full">
        Continue with internet handle
      </Button>

      {identifierState?.error ? (
        <IdentifierFormError reason={identifierState.error} />
      ) : null}
    </form>
  );
}

function IdentifierFormError({ reason }: { reason: ErrorReason }) {
  if (reason === "DID_NOT_FOUND") {
    return (
      <LoginError error="Internet handle not found">
        <div className="prose prose-sm text-destructive">
          <p>
            There was either a typo in your internet handle or a temporary issue
            with the service.
          </p>
        </div>
      </LoginError>
    );
  }

  if (reason === "PDS_NOT_FOUND") {
    return (
      <LoginError error="PDS not found">
        <div className="prose prose-sm text-destructive">
          <p>
            The Personal Data Server (PDS) hosting your internet handle is
            either temporarily down or there is a network issue.
          </p>
        </div>
      </LoginError>
    );
  }

  // TODO: Handle other error reasons

  return (
    <LoginError error="Login error">
      <div className="prose prose-sm">
        <p>An unexpected error occurred. Please try again later.</p>
        <p>Error code: {reason}</p>
      </div>
    </LoginError>
  );
}

function PdsForm() {
  const [pdsState, pdsAction, isPdsPending] = useActionState(
    loginWithPdsAction,
    null,
  );
  return (
    <form
      className="space-y-6"
      action={pdsAction}
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => {
          pdsAction(new FormData(event.currentTarget));
        });
      }}
    >
      <Input
        name="pdsUrl"
        placeholder="eg. bsky.social"
        defaultValue={DEFAULT_PDS_URL}
      />
      <Button type="submit" className="w-full" disabled={isPdsPending}>
        Login
      </Button>

      {pdsState?.error ? <LoginError error={pdsState?.error} /> : null}
    </form>
  );
}
