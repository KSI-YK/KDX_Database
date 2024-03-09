import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from 'swr';

// クライアントデータの型定義
interface Client {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const fetcher = (url: string): Promise<Client[]> =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(res);
    return res.json();
  });

export const SearchSystem: React.FC = () => {
    const { data: clients, error } = useSWR<Client[]>('', fetcher);
    const [selectedClient, setSelectedClient] = useState<string>("");
    const router = useRouter();

    const onSearch = () => {
        router.push(`/query-parameter?client=${selectedClient}`);
    };

    if (error) return <div>Failed to load</div>;
    if (!clients) return <div>Loading...</div>;

    return (
        <form id="searchSystemForm">
            <div className="sm:col-span-4">
                <label htmlFor="client" className="block text-sm font-medium leading-6 text-gray-900">
                    クライアント/Client
                </label>
                <div className="mt-2">
                    <select
                        id="client"
                        name="client"
                        autoComplete="country-name"
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                        <option value="">--客先選択</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sm:col-span-2">
                <button
                    type="button"
                    onClick={onSearch}
                    className="rounded-md bg-indigo-600 px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
