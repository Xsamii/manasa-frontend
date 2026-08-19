import { Routes } from '@angular/router';
import { RoleGuard } from '../shared/guards/role.guard';
import { UserRole } from '../shared/models/user.model';

export const teacherRoutes: Routes = [{
  path: '',
  canActivate: [RoleGuard],
  data: { roles: [UserRole.TEACHER] },
  loadComponent: () => import('./teacher-layout.component').then(c => c.TeacherLayoutComponent),
  children: [
    {
      path: '',
      loadComponent: () => import('./teacher-dashboard.component').then(c => c.TeacherDashboardComponent),
    },
    {
      path: 'courses/:id',
      loadComponent: () => import('./teacher-course-editor.component').then(c => c.TeacherCourseEditorComponent),
    },
    {
      path: 'grading',
      loadComponent: () => import('./teacher-grading-queue.component').then(c => c.TeacherGradingQueueComponent),
    },
    {
      path: 'grading/:type/:id',
      loadComponent: () => import('./teacher-grading-detail.component').then(c => c.TeacherGradingDetailComponent),
    },
    {
      path: 'operations',
      loadComponent: () => import('./teacher-operations.component').then(c => c.TeacherOperationsComponent),
    },
    {
      path: 'analytics',
      loadComponent: () => import('./teacher-community-analytics.component').then(c => c.TeacherCommunityAnalyticsComponent),
    },
    {
      path: 'forum',
      loadComponent: () => import('../main/student-forum/student-forum.component').then(c => c.StudentForumComponent),
    },
  ],
}];
