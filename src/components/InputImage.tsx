import React, { useState, ChangeEvent } from 'react'

type UploadFormProps = {
  onUploadSuccess: (filePath: string) => void
}

const InputImage: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState<{ status: number; body: any }>()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files) // これを追加
    const file = event.target.files ? event.target.files[0] : null
    setFile(file)
  }

  const uploadFile = async (event: React.FormEvent) => {
    event.preventDefault() // デフォルトのフォーム送信を防ぐ

    if (!file) {
      alert('ファイルが選択されていません')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/upload/user`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('ファイルのアップロードに失敗しました')
      }

      const result = await response.json()
      console.log(result) // サーバーからのレスポンス内容を確認
      onUploadSuccess(result.data.filePath)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={uploadFile}>
      <input type="file" name="file" onChange={handleFileChange} />
      <button type="submit">アップロード</button>
    </form>
  )
}

export default InputImage
