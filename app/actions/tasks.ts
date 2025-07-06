'use server';

import prisma from '@/lib/prisma';

export async function getTasks() {
  return prisma.task.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

