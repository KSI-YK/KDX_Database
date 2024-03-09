"use client";
import React, { useEffect } from "react";
import { Container } from '@/components/Container'
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

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

const Page = async ({ params }: { params: { id: string } }) => {
    // リロード用のインスタンス
    const router = useRouter();
    // 入力をフックスで監視
    const nameRef = useRef<HTMLInputElement | null>(null);

    // 編集ボタンを押した際の処理で、RefをaddClient(apiに投げる)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        toast.loading("Sending Request 🚀", { id: "1" });
        await editClient(
            params.id,
            nameRef.current?.value
        );
        toast.success("Successfully", { id: "1" });
        // リロード
        router.push("/database/client");
        router.refresh();
    };

    // 削除ボタンを押した際の処理
    const handleDelete = async () => {
        toast.loading("Sending Request 🚀", { id: "3" });
        await deleteClientById(params.id);
        toast.success("Successfully", { id: "1" });
        // リロード
        router.push("/database/client");
        router.refresh();
    };

    useEffect(() => {
        getClientById(params.id).then((data) => {
            nameRef.current!.value = data.name;
        }).catch(err => {
            toast.error("エラーが発生しました。")
        })
    }, []);

    // html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">
            <Toaster />
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">新規登録</h1>
                    </div>
                </div>
                <div className="sm:flex sm:items-center">
                    <form onSubmit={handleSubmit}>
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <div className="sm:col-span-4">
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
                                </div>
                            </div>
                            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 mx-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    更新
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-600 mx-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Container>
    )
}

export default Page;
