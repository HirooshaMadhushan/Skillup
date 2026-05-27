import prisma from '../config/prisma';
import { ContentType, Difficulty } from '@prisma/client';

export class LessonRepository {
  async create(data: any) {
    const { tags, ...lessonData } = data;
    
    return prisma.lesson.create({
      data: {
        ...lessonData,
        tags: {
          connectOrCreate: tags?.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })) || [],
        },
      },
      include: { category: true, tags: true, tutor: { select: { fullName: true } } },
    });
  }

  async findById(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
      include: { category: true, tags: true, tutor: { select: { fullName: true } } },
    });
  }

  async findAll(filters: any) {
    const { categoryId, difficulty, isPremium, search } = filters;
    
    return prisma.lesson.findMany({
      where: {
        categoryId,
        difficulty: difficulty as Difficulty,
        isPremium: isPremium !== undefined ? isPremium === 'true' : undefined,
        OR: search ? [
          { title: { contains: search } },
          { description: { contains: search } }
        ] : undefined,
      },
      include: { category: true, tags: true, tutor: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    const { tags, ...lessonData } = data;

    return prisma.lesson.update({
      where: { id },
      data: {
        ...lessonData,
        tags: tags ? {
          set: [], // Clear existing tags
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        } : undefined,
      },
      include: { category: true, tags: true },
    });
  }

  async delete(id: string) {
    return prisma.lesson.delete({
      where: { id },
    });
  }

  async findCategoryById(id: string) {
    return prisma.lessonCategory.findUnique({ where: { id } });
  }

  async findAllCategories() {
    return prisma.lessonCategory.findMany();
  }
}
