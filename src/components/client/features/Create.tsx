'use client';

import React from "react";
import { Container } from '@/components/Container'
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

// ユーザー追加処理
const addClient = async (
    name: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/clients`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

const Page = async () => {
    const router = useRouter();
    // 入力をフックスで監視
    const nameRef = useRef<HTMLInputElement | null>(null);

    // ボタンを押した際の処理で、RefをaddClient(apiに投げる)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Sending Request 🚀", { id: "1" });
        await addClient(nameRef.current?.value);
        toast.success("Posted Successfully", { id: "1" });
        // reload
        router.push("/database/client");
        router.refresh();
    }

    // html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">
            <Toaster />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        新規登録/Client
                    </h1>
                </div>
            </div>
            <div className="sm:flex sm:items-center">
                <form onSubmit={handleSubmit}>
                    <div className="sm:flex sm:items-center">
                        <div className="mt-2">
                            <input
                                type="text"
                                ref={nameRef}
                                name="name"
                                id="name"
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="金森メタル"
                            />
                        </div>
                        <div className="mt-2 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 mx-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                            >
                                登録
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default Page;
