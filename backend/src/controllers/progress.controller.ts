import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ProgressController {
  async trackView(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      await prisma.lessonView.create({
        data: {
          lessonId: lessonId!,
          userId: req.user!.userId,
        },
      });
      res.status(200).json({ success: true, message: 'View tracked' });
    } catch (error: any) {
      next(error);
    }
  }

  async markAsCompleted(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId: req.user!.userId,
            lessonId: lessonId!,
          },
        },
        update: {
          isCompleted: true,
          completedAt: new Date(),
        },
        create: {
          userId: req.user!.userId,
          lessonId: lessonId!,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
      res.status(200).json({ success: true, message: 'Lesson marked as completed' });
    } catch (error: any) {
      next(error);
    }
  }
}
