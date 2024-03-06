"use client";

import {signIn, signOut} from "next-auth/react";

// ログインボタン
export const LoginButton = () => {
    return (
        <button className="text-sm font-semibold leading-6 text-gray-900" style={{marginRight: 10}} onClick={() => signIn()}>
            Sign in
        </button>
    );
};

// ログアウトボタン
export const LogoutButton = () => {
    return (
        <button className="text-sm font-semibold leading-6 text-gray-900" onClick={() => signOut()}>
            Sign Out
        </button>
    );
};

