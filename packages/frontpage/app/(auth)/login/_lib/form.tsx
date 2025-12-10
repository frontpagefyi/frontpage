"use client";

import { startTransition, useActionState, useState } from "react";
import { loginWithIdentifierAction, loginWithPdsAction } from "./action";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { Label } from "@/lib/components/ui/label";

const DEFAULT_PDS_URL =
  process.env.NEXT_PUBLIC_DEFAULT_PDS_HOST || "bsky.social";

export function LoginForm() {
  const [pdsDialogOpen, setPdsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <IdentifierForm />

      <Dialog open={pdsDialogOpen} onOpenChange={setPdsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            Continue with your PDS
          </Button>
        </DialogTrigger>
        <DialogContent className="top-1/3">
          <DialogHeader>
            <DialogTitle>Login with PDS</DialogTitle>
            <DialogDescription>
              Enter the URL of your Personal Data Server to login or signup.
            </DialogDescription>
          </DialogHeader>

          <PdsForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoginError({ errorState }: { errorState?: string }) {
  if (!errorState) return null;
  return (
    <Alert variant="destructive">
      <CrossCircledIcon className="h-4 w-4" />
      <AlertTitle>Login error</AlertTitle>
      <AlertDescription>{errorState}</AlertDescription>
    </Alert>
  );
}

function IdentifierForm() {
  const [identifierState, identifierAction, isIdentifierPending] =
    useActionState(loginWithIdentifierAction, null);

  return (
    <form
      className="space-y-6"
      action={identifierAction}
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => {
          identifierAction(new FormData(event.currentTarget));
        });
      }}
    >
      <div>
        <Label htmlFor="identifier">
          Internet Handle
          <sup>
            {" "}
            <a
              href="https://internethandle.org/#start"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              ?
            </a>
          </sup>{" "}
          or DID
        </Label>

        <div className="flex gap-2">
          <Input
            id="identifier"
            name="identifier"
            required
            placeholder="eg. dril.bsky.social"
          />
          <Button type="submit" disabled={isIdentifierPending}>
            Login
          </Button>
        </div>
      </div>

      <LoginError errorState={identifierState?.error} />
    </form>
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

      <LoginError errorState={pdsState?.error} />
    </form>
  );
}
