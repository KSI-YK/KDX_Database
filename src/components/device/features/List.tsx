"use client";

import React from 'react';
import { Clients, Devices, Systems, User } from '@prisma/client';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Button } from '@/components/Button';

// System モデルに関連付けられた Client モデルのデータを含む
type SystemWith = Devices & {
  system: Systems & {
    client: Clients;
  }
} & {
  director: User;
};

interface SearchResultsListProps {
  searchResults: SystemWith[];
};

const SearchResultsList: React.FC<SearchResultsListProps> = ({ searchResults }) => {
  return (
    <Container className="pb-2 pt-20 lg:pt-6">

      {/* 新規追加ボタン */}
      <div className="flex flex-row-reverse my-4">
        <div>
          <Button href="/database/device/add" className='sticky top-1'>
            新規追加
          </Button>
        </div>
      </div>

      {/* クライアントリスト */}
      <ul role="list" className="divide-y divide-gray-100">
        {Array.isArray(searchResults) && searchResults.map((result) => (
          <li key={result.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200">{result.system.client.name}_{result.system.name}_{result.name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">Client:{result.system.client.name}/Director:{result.director.name}/Model:{result.model}</p>

              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900 dark:text-slate-200">
                <Link href={`/database/device/edit/${result.id}`}>
                  編集
                </Link>
              </p>
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">
                  {new Date(result.updatedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long', // これは曜日を表示する場合に追加します
                  })}

                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default SearchResultsList;
