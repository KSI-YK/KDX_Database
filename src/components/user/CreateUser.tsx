'use client'

import { Container } from '@/components/Container'
import { getServerSession } from 'next-auth'
import { options } from '@/lib/options'
import { Departments, UserPosts, UserTypes } from '@prisma/client'
import UploadForm from '../InputImage'
import React, { useState } from 'react'

interface Props {
  departments: Departments[]
  userTypes: UserTypes[]
  userPosts: UserPosts[]
}

const CreateUser: React.FC<Props> = ({ departments, userTypes, userPosts }) => {
  const [filePath, setFilePath] = useState('')

  const handleUploadSuccess = (path: string) => {
    const webPath = path.replace('./public', '')
    setFilePath(webPath)
    console.log('アップロードされたファイルのパス:', webPath)
  }

  const handleCancel = async () => {
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: `public/images/user/${filePath.split('/').pop()}` }), // ファイル名をサーバーの相対パスに変換
      });
      if (!response.ok) {
        throw new Error('Failed to delete the file');
      }
      // ファイル削除成功
      setFilePath(''); // UIから画像を削除
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };

  //html生成
  return (
    <Container className="pb-2 pt-20 lg:pt-6">
      {/* ファイルをアップロード */}
      <div>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
        {filePath && (
          <>
            <p>アップロードされたファイル: {filePath}</p>
            {/* 画像を表示 */}
            <img
              src={filePath}
              alt="Uploaded"
              style={{ maxWidth: '100%', height: 'auto' }}
            />

            {/* キャンセルボタン */}
            <button onClick={handleCancel}>キャンセル</button>
          </>
        )}
      </div>
    </Container>
  )
}

export default CreateUser
