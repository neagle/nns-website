"use client";

import { useActionState } from "react";
import FloatingLabelInput from "@/app/components/FloatingLabelInput";
import { subscribeToMailingList } from "@/app/actions/mailingList";

type State = { success: boolean; message: string } | null;

const initialState: State = null;

export default function MailingListSignup() {
  const [state, formAction, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => subscribeToMailingList(formData),
    initialState
  );

  return (
    <div className="mt-6 pt-6 border-t border-base-300">
      <h3 className="text-xl mb-3 md:text-center">Join Our Mailing List</h3>
      {state?.success ? (
        <p className="text-center text-success font-medium">{state.message}</p>
      ) : (
        <>
          {state && !state.success && (
            <div role="alert" className="alert alert-error mb-3 text-sm">
              {state.message}
            </div>
          )}
          <form action={formAction}>
            <div className="flex flex-col gap-3">
              <FloatingLabelInput
                id="email"
                label="Email address"
                type="email"
                required
              />
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary w-full"
              >
                {isPending ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
