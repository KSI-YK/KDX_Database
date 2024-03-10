"use client";
import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { Container } from '@/components/Container';
import { useEffect, useState } from 'react';
import { Clients, Systems, User } from '@prisma/client';
import * as System from '@/components/system/index';

// System モデルに関連付けられた Client モデルのデータを含む
type SystemWith = Systems & {
  client: Clients;
} & {
  director: User;
};

const SearchComponent: React.FC = () => {

  // 入力をフックスで監視
  const [searchResults, setSearchResults] = useState<SystemWith[]>([]);

  // 検索処理を行う関数　※入力変更のたびに呼び出されてしまう。検索ボタンの方が良いか？
  const handleSearch = async (searchTerm: string) => {
    let url = 'http://localhost:3000/api/systems';

    // searchTermが空でない場合、検索用URLを使用
    if (searchTerm.trim() !== '') {
      url += `/search/${encodeURIComponent(searchTerm)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setSearchResults(data.systems); // 検索結果でステートを更新
  };

  // 初回の読み込み処理
  useEffect(() => {
    const fetchSystems = async () => {
      const response = await fetch('http://localhost:3000/api/systems');
      const data = await response.json();
      console.log(data.systems)
      setSearchResults(data.sytems); // フェッチしたデータをステートに設定
    };

    fetchSystems();
  }, []); // 依存配列を空にすることで、コンポーネントのマウント時にのみ実行される

  return (
    <>
      <Header />
      <main>
        <Container className="pb-2 pt-20 lg:pt-6">
          <div className="space-y-4">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <div className="border-b border-gray-900/10 pb-4 pt-4">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">検索/Systems</h1>
                </div>
              </div>
            </div>

            {/* 検索フォーム */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <h1 className="text-base font-semibold leading-6 text-gray-900">設備名/Name</h1>
              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>

              <div className="col-span-1">
                <h1 className="text-base font-semibold leading-6 text-gray-900">企業名/Client</h1>
              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>

              <div className="col-span-1">
                <h1 className="text-base font-semibold leading-6 text-gray-900">担当者/Director</h1>
              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>

            </div>
          </div>
        </Container>

        {/* リストのコンポーネントを常時更新 */}
        <System.List searchResults={searchResults} />
      </main>
      <Footer />
    </>
  );
};

export default SearchComponent;
