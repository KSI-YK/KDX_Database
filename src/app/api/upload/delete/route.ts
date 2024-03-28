// app/api/upload/delete/route.ts
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  // JSON形式のリクエストボディを処理
  const body = await req.json();
  const filePath = body.filePath;
  
  if (!filePath) {
    return new Response(JSON.stringify({ status: 'fail', message: 'File path is missing' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const absolutePath = path.join(process.cwd(), 'public', 'images', 'user', path.basename(filePath));
    fs.unlinkSync(absolutePath);

    return new Response(JSON.stringify({ status: 'success', message: 'File deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'fail', message: 'Failed to delete the file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
