"use client";

import React, { useState } from "react";
import { Container } from '@/components/Container'
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Clients, User } from '@prisma/client';
import Select from 'react-select';

interface CreatePageProps {
    clients: Clients[];
    user: User[];
}

interface Option {
    value: string;
    label: string;
}

// ユーザー追加処理
const addSystem = async (
    name: string | undefined,
    model: string | undefined,
    total_cnt: string | undefined,
    clientId: string | undefined,
    directorId: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/systems`, {
        method: "POST",
        body: JSON.stringify({ name, clientId, directorId, model, total_cnt }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}


const CreatePage: React.FC<CreatePageProps> = ({ clients, user }) => {
    const router = useRouter();
    const [selectedClient, setSelectedClient] = useState<Option | null>(null);
    const [selectedDirector, setSelectedDirector] = useState<Option | null>(null);
    const [systemName, setSystemName] = useState("");
    const [systemModel, setSystemModel] = useState("");
    const [systemTotalCnt, setSystemTotalCnt] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClient && selectedDirector) {
            await addSystem(
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

    // clientsを適切な形式に変換
    const clientOptions = clients.map(client => ({ value: client.id, label: client.name }));
    const userOptions = user.map(user => ({ value: user.id, label: user.name }));


    // html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">

            <div className="space-y-4">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="border-b border-gray-300 dark:border-gray-500 pb-4 pt-4">
                            <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-200">新規登録/System</h1>
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
                            <Select
                                className="basic-single rounded-md bg-slate-800 dark:bg-slate-800 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="client"
                                options={clientOptions}
                                onChange={setSelectedClient}
                            />
                        </div>

                        {/* 設備名入力 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 dark:text-slate-200 text-gray-900">設備名/Name</h1>
                        </div>

                        <div className="col-span-3">
                            <input
                                type="text"
                                onChange={(e) => setSystemName(e.target.value)}
                                name="name"
                                id="name"
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="KDM造型ライン"
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
                                name="name"
                                id="name"
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="KDM-4-AR"
                            />
                        </div>

                        {/* 責任者選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">責任者/Director</h1>
                        </div>

                        <div className="col-span-3">
                            <Select
                                className="basic-single rounded-md dark:bg-slate-800 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="director"
                                options={userOptions}
                                onChange={setSelectedDirector}
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
                                name="name"
                                id="name"
                                autoComplete="username"
                                defaultValue={0}
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

export default CreatePage;