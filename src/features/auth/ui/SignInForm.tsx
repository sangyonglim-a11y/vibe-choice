"use client";

import { GoogleSignInButton } from "./GoogleSignInButton";

type SignInFormProps = {
  nextPath?: string;
};

export function SignInForm({ nextPath = "/" }: SignInFormProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[color:var(--muted)]">
        Google 계정으로 간편하게 로그인하고 투표·댓글·게임 만들기를
        이용하세요.
      </p>
      <GoogleSignInButton nextPath={nextPath} />
    </div>
  );
}
