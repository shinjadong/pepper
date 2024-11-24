import { BaseNote } from '@/types';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

export class SyncManager {
  private prisma: PrismaClient;
  private supabase;

  constructor() {
    this.prisma = new PrismaClient();
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async syncNote(note: BaseNote) {
    // Prisma로 로컬 DB 저장
    await this.prisma.note.upsert({
      where: { id: note.id },
      create: note,
      update: note,
    });

    // Supabase로 클라우드 동기화
    await this.supabase.from('notes').upsert(note);
  }
}
