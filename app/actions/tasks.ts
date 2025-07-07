'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';


export async function getTasks() {
  return prisma.task.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

// Add task server action
export async function addTask(title: string) {
  try {
    const task = await prisma.task.create({
      data: { title, completed: false }
    });
    revalidatePath('/');
    return { success: true, task };
  } catch (error) {
    return { success: false, error: 'Failed to create task' };
  }
}

// Delete task server action
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({ where: { id } });
    revalidatePath('/');
    return { success: true, id };
  } catch (error) {
    return { success: false, error: 'Failed to delete task' };
  }
}


