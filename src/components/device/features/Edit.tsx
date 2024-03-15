"use client";

import React, { useEffect, useState } from "react";
import { Container } from '@/components/Container'
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Clients, Devices, Systems, User } from "@prisma/client";
import Select from 'react-select';

interface Option {
    value: string;
    label: string;
}

// System モデルに関連付けられた Client モデルのデータを含む
type deviceWithClient = (Devices & {
    system: {
        client: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        model: string | null;
        total_cnt: string | null;
        clientId: string;
        directorId: string;
        createdAt: Date;
        updatedAt: Date;
    };
  } & {director: User}
  ) | null | undefined

interface CreatePageProps {
    id: string;
    clientName: string | undefined;
    systemName: string | undefined;
    device: deviceWithClient;
    users: User[];
}

// 編集処理
const editDevice = async (
    id: string | undefined,
    name: string | undefined,
    model: string | undefined,
    systemId: string | undefined,
    directorId: string | undefined
) => {
    // api
    const res = await fetch(`http://localhost:3000/api/devices/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, name, model, systemId, directorId }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

// 削除処理
const deleteDeviceById = async (id: string) => {
    const res = fetch(`http://localhost:3000/api/devices/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await res).json();
};

const Page: React.FC<CreatePageProps> = ({ id, clientName, systemName, users, device }) => {
    // リロード用のインスタンス
    const router = useRouter();
    const userOptions = users.map(user => ({ value: user.id, label: user.name }));
    // 入力をフックスで監視
    const [selectedDirector, setDirector] = useState<Option | null>(null);
    const [deviceName, setDeviceName] = useState("");
    const [deviceModel, setDeviceModel] = useState("");
    const systemId = device?.systemId;

    // 初回読み出し時に、Inputに値を入力する
    useEffect(() => {
        const fetchData = async () => {
            try {
                setDeviceName(device?.name ?? "");
                setDeviceModel(device?.model ?? "" );
                setDirector({
                    value: device?.directorId ?? "",
                    label: device?.director.name ?? ""
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []); // 依存配列が空なので、コンポーネントがマウントされた時に1回だけ実行されます。


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDirector) {
            console.log(deviceName)
            await editDevice(
                id,
                deviceName,
                deviceModel,
                systemId,
                selectedDirector.value,
            );
            router.push("/database/device");
            router.refresh
        }
    }

    // 削除ボタンを押した際の処理
    const handleDelete = async () => {
        await deleteDeviceById(id);
        // リロード
        router.push("/database/device");
        router.refresh();
    };

    // html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">
            <div className="space-y-4">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="border-b border-gray-900/10 pb-4 pt-4">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">編集/Systems</h1>
                        </div>
                    </div>
                </div>

                {/* 検索フォーム */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-4 gap-4">
                        {/* 企業名選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900">企業名/Client</h1>
                        </div>

                        <div className="col-span-3">
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{clientName}</p>
                        </div>

                        {/* 設備選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900">設備名/System</h1>
                        </div>

                        <div className="col-span-3">
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{systemName}</p>
                        </div>

                        {/* 装置名入力 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900">装置名/Name</h1>
                        </div>

                        <div className="col-span-3">
                            <input
                                type="text"
                                onChange={(e) => setDeviceName(e.target.value)}
                                defaultValue={device?.name}
                                autoComplete="username"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="KDM型造型機"
                            />
                        </div>

                        {/* 責任者選択 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900">責任者/Director</h1>
                        </div>

                        <div className="col-span-3">
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">id:{selectedDirector?.value}</p>

                            <Select
                                className="basic-single text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="director"
                                // defaultValueだとレンダリングタイミングが合わず、表示されない。
                                value={selectedDirector}
                                options={userOptions}
                                onChange={setDirector}
                            />
                        </div>

                        

                        {/* 型式入力 */}

                        <div className="col-span-1">
                            <h1 className="text-base leading-4 text-gray-900">型式/Model</h1>
                        </div>

                        <div className="col-span-3">
                            <input
                                type="text"
                                onChange={(e) => setDeviceModel(e.target.value)}
                                defaultValue={device?.model ?? ""}
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
