import { Response, NextFunction } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const assignmentService = new AssignmentService();

export class AssignmentController {
  async createAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : undefined;
      const assignment = await assignmentService.createAssignment(
        { ...req.body, fileUrl },
        req.user!.userId
      );
      res.status(201).json({ success: true, data: assignment });
    } catch (error: any) {
      next(error);
    }
  }

  async submitWork(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('Submission file is required');
      const fileUrl = `/uploads/submissions/${req.file.filename}`;
      const submission = await assignmentService.submitWork({
        assignmentId: req.params.assignmentId as string,
        learnerId: req.user!.userId,
        fileUrl,
        content: req.body.content,
      });
      res.status(201).json({ success: true, data: submission });
    } catch (error: any) {
      next(error);
    }
  }

  async reviewSubmission(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await assignmentService.reviewSubmission({
        ...req.body,
        submissionId: req.params.submissionId as string,
        tutorId: req.user!.userId,
      });
      res.status(201).json({ success: true, data: review });
    } catch (error: any) {
      next(error);
    }
  }

  async getAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const assignments = await assignmentService.getAllAssignments(req.query);
      res.status(200).json({ success: true, data: assignments });
    } catch (error: any) {
      next(error);
    }
  }

  async getSubmissions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const submissions = await assignmentService.getSubmissions(
        req.params.assignmentId as string,
        req.user!.userId
      );
      res.status(200).json({ success: true, data: submissions });
    } catch (error: any) {
      next(error);
    }
  }
}
