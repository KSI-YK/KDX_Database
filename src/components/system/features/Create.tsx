"use client";

import React from "react";
import { Container } from '@/components/Container'
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

// ユーザー追加処理
const addClient = async (
    name: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/systems`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

const Page = () => {
    const router = useRouter();
    // 入力をフックスで監視
    const nameRef = useRef<HTMLInputElement | null>(null);
    const modelRef = useRef<HTMLInputElement | null>(null);
    const total_cntRef = useRef<HTMLInputElement | null>(null);
    const clientIdRef = useRef<HTMLInputElement | null>(null);
    const directorIdRef = useRef<HTMLInputElement | null>(null);


    // ボタンを押した際の処理で、RefをaddClient(apiに投げる)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addClient(nameRef.current?.value);
        // reload
        router.push("/database/client");
        router.refresh();
    }

    // html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">

            <div className="space-y-4">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="border-b border-gray-900/10 pb-4 pt-4">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">新規登録/Clients</h1>
                        </div>
                    </div>
                </div>

                {/* 検索フォーム */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">企業名/Name</h1>
                        </div>

                        <div className="col-span-3">
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

                    </div>

                    <div className="flex flex-row-reverse my-4">
                        <div>
                            <Button
                                type="submit"
                            >
                                登録
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default Page;
