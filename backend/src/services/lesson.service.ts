import { LessonRepository } from '../repositories/lesson.repository';

export class LessonService {
  private lessonRepository: LessonRepository;

  constructor() {
    this.lessonRepository = new LessonRepository();
  }

  async createLesson(data: any, tutorId: string) {
    // Check if category exists
    const category = await this.lessonRepository.findCategoryById(data.categoryId);
    if (!category) throw new Error('Invalid Category ID');

    // Parse tags if they come as comma-separated string
    const tags = typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags;

    return this.lessonRepository.create({
      ...data,
      tutorId,
      tags,
    });
  }

  async getAllLessons(filters: any) {
    return this.lessonRepository.findAll(filters);
  }

  async getLessonById(id: string) {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  }

  async updateLesson(id: string, data: any, tutorId: string) {
    const lesson = await this.getLessonById(id);
    if (lesson.tutorId !== tutorId) throw new Error('Unauthorized to update this lesson');

    const tags = typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags;

    return this.lessonRepository.update(id, { ...data, tags });
  }

  async deleteLesson(id: string, tutorId: string) {
    const lesson = await this.getLessonById(id);
    if (lesson.tutorId !== tutorId) throw new Error('Unauthorized to delete this lesson');

    return this.lessonRepository.delete(id);
  }
}
