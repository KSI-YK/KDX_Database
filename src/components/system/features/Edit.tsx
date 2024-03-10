"use client";

import React, { useEffect } from "react";
import { Container } from '@/components/Container'
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

// 編集処理
const editClient = async (
    id: string | undefined,
    name: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, name }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

// 指定取得処理
const getClientById = async (id: string | undefined) => {
    // api
    const res = await fetch(`http://localhost:3000/api/clients/${id}`);
    const data = await res.json();
    return data.client;
};

// 削除処理
const deleteClientById = async (id: string) => {
    const res = fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await res).json();
};

const Page = ({ params }: { params: { id: string } }) => {
    // リロード用のインスタンス
    const router = useRouter();
    // 入力をフックスで監視
    const nameRef = useRef<HTMLInputElement | null>(null);

    // 編集ボタンを押した際の処理で、RefをaddClient(apiに投げる)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nameRef.current) {
            await editClient(params.id, nameRef.current.value);
            // リロード
            router.push("/database/client");
            router.refresh();
        }
    };

    // 削除ボタンを押した際の処理
    const handleDelete = async () => {
        await deleteClientById(params.id);
        // リロード
        router.push("/database/client");
        router.refresh();
    };

    // 初回読み出し時に、Inputに値を入力する
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getClientById(params.id);
                nameRef.current!.value = data.name;
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []); // 依存配列が空なので、コンポーネントがマウントされた時に1回だけ実行されます。

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
                        <div className="ms-8">
                            <Button
                                type="submit"
                            >
                                更新
                            </Button>
                        </div>

                        <div className="ms-8">
                            <Button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-500"
                            >
                                削除
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default Page;
