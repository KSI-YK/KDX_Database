"use client";

import {SessionProvider} from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

type Props = {
    children?: React.ReactNode;
};

export const NextAuthProvider = ({children}: Props) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};
