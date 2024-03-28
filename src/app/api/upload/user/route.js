import { NextResponse } from 'next/server'
import fs from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'
const pump = promisify(pipeline)

export async function POST(req) {
  try {
    console.log('Start processing form data');
    const formData = await req.formData();
    console.log('Form data processed:', formData);

    const files = formData.getAll('file'); 
    if (!files.length) {
      console.log('No files found in the form data');
      return NextResponse.json({ status: 'fail', data: 'No files uploaded' });
    }

    const file = files[0];
    if (!file || !file.name) {
      console.log('File or file name not found');
      return NextResponse.json({ status: 'fail', data: 'File or file name not found' });
    }

    // ファイルの処理が成功した場合のレスポンスを追加
    // 例: ファイルを保存し、その結果に基づいてレスポンスを返す
    const filePath = `./public/images/user/${file.name}`;

    console.log(filePath)
    await pump(file.stream(), fs.createWriteStream(filePath));
    // 成功レスポンス
    return NextResponse.json({ status: 'success', data: { filePath: filePath, size: file.size } });
    
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ status: 'fail', data: e.message });
  }
}
