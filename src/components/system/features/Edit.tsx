"use client";

import React, { useEffect, useState } from "react";
import { Container } from '@/components/Container'
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Clients, User } from "@prisma/client";
import Select from 'react-select';

interface Option {
    value: string;
    label: string;
}

interface CreatePageProps {
    clients: Clients[];
    user: User[];
    id: string;
}

// 編集処理
const editSystem = async (
    id: string | undefined,
    name: string | undefined,
    model: string | undefined,
    total_cnt: string | undefined,
    clientId: string | undefined,
    directorId: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/systems/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, name, model, total_cnt, clientId, directorId }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

// 指定取得処理
const getSystemById = async (id: string | undefined) => {
    // api
    const res = await fetch(`http://localhost:3000/api/systems/${id}`);
    const data = await res.json();
    return data.systems;
};

// 削除処理
const deleteSystemById = async (id: string) => {
    const res = fetch(`http://localhost:3000/api/systems/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await res).json();
};

const Page: React.FC<CreatePageProps> = ({ id, clients, user }) => {
    // リロード用のインスタンス
    const router = useRouter();
    // clientsを適切な形式に変換
    const clientOptions = clients.map(client => ({ value: client.id, label: client.name }));
    const userOptions = user.map(user => ({ value: user.id, label: user.name }));
    // 入力をフックスで監視
    const [selectedClient, setClient] = useState<Option | null>(null);
    const [selectedDirector, setDirector] = useState<Option | null>(null);
    const [systemName, setSystemName] = useState("");
    const [systemModel, setSystemModel] = useState("");
    const [systemTotalCnt, setSystemTotalCnt] = useState("");

    // 初回読み出し時に、Inputに値を入力する
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSystemById(id);
                setSystemName(data.name);
                setSystemModel(data.model);
                setSystemTotalCnt(data.total_cnt);
                setClient({
                    value: data.clientId,
                    label: data.client.name
                });
                setDirector({
                    value: data.directorId,
                    label: data.director.name
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []); // 依存配列が空なので、コンポーネントがマウントされた時に1回だけ実行されます。


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClient && selectedDirector) {
            await editSystem(
                id,
                systemName,
                systemModel,
                systemTotalCnt,
                selectedClient.value,
                selectedDirector.value
            );
            router.push("/database/system");
            router.refresh
        }
    }

    // 削除ボタンを押した際の処理
    const handleDelete = async () => {
        await deleteSystemById(id);
        // リロード
        router.push("/database/system");
        router.refresh();
    };

    // html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">
            <div className="space-y-4">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="border-b border-gray-300 dark:border-gray-500 pb-4 pt-4">
                            <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-200">編集/Systems</h1>
                        </div>
                    </div>
                </div>

                {/* 検索フォーム */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 gap-4">
                        {/* 企業名選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">企業名/Client</h1>
                        </div>

                        <div className="col-span-3">
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">id:{selectedClient?.value}</p>

                            <Select
                                className="basic-single rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="client"
                                // defaultValueだとレンダリングタイミングが合わず、表示されない。
                                value={selectedClient}
                                options={clientOptions}
                                onChange={setClient}
                            />
                        </div>

                        {/* 設備名入力 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">設備名/Name</h1>
                        </div>

                        <div className="col-span-3">
                            <input
                                type="text"
                                onChange={(e) => setSystemName(e.target.value)}
                                defaultValue={systemName}
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="金森メタル"
                            />
                        </div>

                        {/* 型式入力 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">型式/Model</h1>
                        </div>

                        <div className="col-span-3">
                            <input
                                type="text"
                                onChange={(e) => setSystemModel(e.target.value)}
                                defaultValue={systemModel}
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="金森メタル"
                            />
                        </div>

                        {/* 責任者選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">責任者/Director</h1>
                        </div>

                        <div className="col-span-3">
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">id:{selectedDirector?.value}</p>

                            <Select
                                className="basic-single rounded-md text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="director"
                                // defaultValueだとレンダリングタイミングが合わず、表示されない。
                                value={selectedDirector}
                                options={userOptions}
                                onChange={setDirector}
                            />
                        </div>

                        {/* トータルカウンタ入力 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">トータルカウンタ/Total Cnt</h1>
                        </div>

                        <div className="col-span-3">
                            <input
                                type="text"
                                onChange={(e) => setSystemTotalCnt(e.target.value)}
                                defaultValue={systemTotalCnt}
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
