'use client'

import { Container } from '@/components/Container'
import { Departments, UserPosts, UserTypes } from '@prisma/client'
import InputImage from '../InputImage'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '@/lib/formSchema'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

interface Props {
  departments: Departments[]
  userTypes: UserTypes[]
  userPosts: UserPosts[]
}

const CreateUser: React.FC<Props> = ({ departments, userTypes, userPosts }) => {
  const [filePath, setFilePath] = useState('')
  const formMethods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      hashedPassword: '',
      image: null,
      email: '',
    },
  })

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
        body: JSON.stringify({
          filePath: `public/images/user/${filePath.split('/').pop()}`,
        }), // ファイル名をサーバーの相対パスに変換
      })
      if (!response.ok) {
        throw new Error('Failed to delete the file')
      }
      // ファイル削除成功
      setFilePath('') // UIから画像を削除
    } catch (error) {
      console.error('Error deleting the file:', error)
    }
  }

  //html生成
  return (
    <Container className="pb-2 pt-20 lg:pt-6">
      {/* ファイルをアップロード */}
      <div>
        {/* FormProviderを使ってフォームのコンテキストを提供 */}
        <FormProvider {...formMethods}>
          {/* フォームの内容 */}
          <form
            onSubmit={formMethods.handleSubmit((data) => console.log(data))}
          >
            <Input
              placeholder="Username"
              {...formMethods.register('username')}
            />
            <Input
              placeholder="Password"
              {...formMethods.register('hashedPassword')}
            />
            <Input
              placeholder="従業員名"
              {...formMethods.register('username')}
            />
            <Input
              placeholder="email"
              {...formMethods.register('email')}
            />
            <InputImage onUploadSuccess={handleUploadSuccess} />
            {filePath && (
              <>
                <p>アップロードされたファイル: {filePath}</p>
                <img src={filePath} alt="Uploaded" />
                <button onClick={handleCancel}>キャンセル</button>
              </>
            )}
            {/* その他のフォーム要素 */}
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}

export default CreateUser
