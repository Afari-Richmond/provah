"use client";

import { logOut } from "@/lib/actions/auth";

export function LogoutLink({ style }: { style?: React.CSSProperties }) {
  return (
    <form action={logOut}>
      <button type="submit" style={{ ...style, background: "none", border: "none" }}>
        LOG OUT
      </button>
    </form>
  );
}
