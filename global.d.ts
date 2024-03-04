// global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // NodeJS.Globalインターフェースにprismaプロパティを追加
  var prisma: PrismaClient | undefined;
}
