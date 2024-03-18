"use client";

import React, { useState } from "react";
import { Container } from '@/components/Container'
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Clients, Systems, User } from '@prisma/client';
import Select from 'react-select';

interface CreatePageProps {
    clients: Clients[];
    user: User[];
}

type system = Systems

interface Option {
    value: string;
    label: string;
}

// ユーザー追加処理
const addSystem = async (
    name: string | undefined,
    model: string | undefined,
    systemId: string | undefined,
    directorId: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/devices`, {
        method: "POST",
        body: JSON.stringify({ name, model, systemId, directorId}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

// 指定取得処理
const getSystemsForClient = async (id: string | undefined) => {
    // api
    const res = await fetch(`http://localhost:3000/api/systems/searchClientId/${id}`);
    const data = await res.json();
    return data.systems;
};


const CreatePage: React.FC<CreatePageProps> = ({ clients, user }) => {
    const router = useRouter();
    const [selectedClient, setSelectedClient] = useState<Option | null>(null);
    const [selectedSystem, setSelectedSystem] = useState<Option | null>(null);
    const [systemOptions, setSystemOptions] = useState<Option[]>([]);

    const [selectedDirector, setSelectedDirector] = useState<Option | null>(null);
    const [systemName, setSystemName] = useState("");
    const [systemModel, setSystemModel] = useState("");

    const handleClientChange = async (selectedOption: Option | null) => {
        setSelectedClient(selectedOption);
        if (selectedOption) {
            // 選択されたクライアントに基づいて利用可能なシステムを取得するAPIを呼び出すなど
            // ここでは仮のロジックを示します。実際には、API呼び出しや、
            // 既にフロントエンドにあるデータからフィルタリングするなどの方法が考えられます。
            const systemsForSelectedClient = await getSystemsForClient(selectedOption.value);
            const newSystemOptions = systemsForSelectedClient.map((system: Systems) => ({
                value: system.id,
                label: system.name
            }));
            setSystemOptions(newSystemOptions);
        } else {
            setSystemOptions([]);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSystem && selectedDirector) {
            await addSystem(
                systemName,
                systemModel,
                selectedSystem.value,
                selectedDirector.value
        );
            router.push("/database/device");
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
                        <div className="border-b border-gray-900/10 pb-4 pt-4">
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
                                className="basic-single rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="client"
                                options={clientOptions}
                                onChange={handleClientChange} // ここを更新
                            />
                        </div>

                        {/* 設備名選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">装置名/System</h1>

                        </div>

                        <div className="col-span-3">
                            <Select
                                className="basic-single rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="client"
                                options={systemOptions}
                                onChange={setSelectedSystem}
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
                                name="name"
                                id="name"
                                className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="KDM4型造型期"
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
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-slate-800 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="KDM-4"
                            />
                        </div>

                        {/* 責任者選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900 dark:text-slate-200">責任者/Director</h1>
                        </div>

                        <div className="col-span-3">
                            <Select
                                className="basic-single rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="director"
                                options={userOptions}
                                onChange={setSelectedDirector}
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