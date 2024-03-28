// app/api/images.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  // 実際のプロジェクトでは、publicディレクトリのパスを適切に設定してください。
  const directoryPath = path.join(process.cwd(), 'public', 'images', 'user');

  try {
    const files = fs.readdirSync(directoryPath);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    // 画像ファイル名のリストをJSONとして返す
    return new Response(JSON.stringify(imageFiles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Unable to scan directory: ' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
