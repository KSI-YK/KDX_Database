"use client";
import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { Container } from '@/components/Container';
import { useEffect, useRef, useState } from 'react';
import { Clients, Devices, Systems, User } from '@prisma/client';
import * as Device from '@/components/device/index';

// System モデルに関連付けられた Client モデルのデータを含む
type SystemWith = Devices & {
  system: Systems & {
    client: Clients;
  }
} & {
  director: User;
};

const SearchComponent: React.FC = () => {

  // 入力をフックスで監視
  const [searchResults, setSearchResults] = useState<SystemWith[]>([]);

  const clientRef = useRef<HTMLInputElement | null>(null);
  const directorRef = useRef<HTMLInputElement | null>(null);
  const systemRef = useRef<HTMLInputElement | null>(null);
  const deviceRef = useRef<HTMLInputElement | null>(null);

  // useEffectフックを使用して、コンポーネントがマウントされた時に実行される処理を定義します
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/devices');
        const data = await response.json();
        // 取得したデータでsystemsステートを更新します
        setSearchResults(data.devices);
      } catch (error) {
        console.error('システムの取得に失敗しました:', error);
      }
    };

    fetchSystems();
  }, []); // 依存配列を空にすることで、コンポーネントがマウントされた時にのみ実行されます


  // 検索処理を行う関数　※入力変更のたびに呼び出されてしまう。検索ボタンの方が良いか？
  const handleSearch = async (searchTerm: string) => {
    let url = 'http://localhost:3000/api/devices';

    // searchTermが空でない場合、検索用URLを使用
    if (searchTerm.trim() !== '') {
      url += `/search/${clientRef.current!.value}&${directorRef.current!.value}&${systemRef.current!.value}&${deviceRef.current!.value}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setSearchResults(data.devices); // 検索結果でステートを更新
  };



  return (
    <>
      <Header />
      <main>
        <Container className="pb-2 pt-20 lg:pt-6">
          <div className="space-y-4">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <div className="border-b border-gray-900/10 pb-4 pt-4">
                  <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-slate-200">検索/Systems</h1>
                </div>
              </div>
            </div>

            {/* 検索フォーム */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <h2 className="text-base text-gray-900 dark:text-slate-200">企業名/Client</h2>

              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  ref={clientRef}
                  className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>

              <div className="col-span-1">
                <h2 className="text-base text-gray-900 dark:text-slate-200">責任者/Director</h2>

              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  ref={directorRef}
                  className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>

              <div className="col-span-1">
                <h2 className="text-base text-gray-900 dark:text-slate-200">設備名/System Name</h2>

              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  ref={systemRef}
                  className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>

              <div className="col-span-1">
                <h2 className="text-base text-gray-900 dark:text-slate-200">装置名/Device Name</h2>

              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  ref={deviceRef}
                  className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="検索..."
                />
              </div>
            </div>
          </div>
        </Container>

        {/* リストのコンポーネントを常時更新 */}
        <Device.List searchResults={searchResults} />
      </main>
      <Footer />
    </>
  );
};

export default SearchComponent;
