"use client";

import React from 'react';
import { Clients } from '@prisma/client';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Button } from '@/components/Button';


interface SearchResultsListProps {
  searchResults: Clients[];
};

const SearchResultsList: React.FC<SearchResultsListProps> = ({ searchResults }) => {
  return (
    <Container className="pb-2 pt-20 lg:pt-6">

      {/* 新規追加ボタン */}
      <div className="flex flex-row-reverse my-4">
        <div>
          <Button href="/database/client/add" className='sticky top-1'>
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
                <p className="text-sm font-semibold leading-6 text-gray-900">{result.name}</p>
                {/* <p className="mt-1 truncate text-xs leading-5 text-gray-500">{result.email}</p> */}
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                <Link href={`/database/client/edit/${result.id}`}>
                  編集
                </Link>
              </p>
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">
                  {new Date(result.updatedAt).toDateString()}
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
