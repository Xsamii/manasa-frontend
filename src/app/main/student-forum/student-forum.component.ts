import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeacherAuthoringService } from '../../teacher/teacher-authoring.service';
import { UserRole } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { CourseService } from '../../shared/services/course.service';
import {
  ForumPost,
  ForumReply,
  ForumService,
} from '../../shared/services/student-forum.service';

@Component({
  selector: 'app-student-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-forum.component.html',
  styleUrl: './student-forum.component.scss'
})
export class StudentForumComponent implements OnInit {
  courses: Array<{ id: number; title: string }> = [];
  courseId: number | null = null;
  topics: ForumPost[] = [];
  selected: (ForumPost & { replies: ForumReply[] }) | null = null;
  page = 1;
  totalRecords = 0;
  title = '';
  content = '';
  reply = '';
  loading = false;
  error = '';

  constructor(
    private readonly forum: ForumService,
    private readonly courseService: CourseService,
    private readonly teacherCourses: TeacherAuthoringService,
    private readonly auth: AuthService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.auth.currentUser?.role === UserRole.TEACHER) {
      this.teacherCourses.listCourses().subscribe({
        next: response => {
          if (response.success) this.setCourses(response.data);
        },
        error: () => this.error = 'تعذر تحميل الكورسات.',
      });
    } else {
      this.courseService.getMyCourses().subscribe({
        next: response => {
          if (response.success) this.setCourses(response.data);
        },
        error: () => this.error = 'تعذر تحميل الكورسات المسجلة.',
      });
    }
  }

  private setCourses(courses: Array<{ id: number; title: string }>): void {
    this.courses = courses;
    const requested = Number(this.route.snapshot.queryParamMap.get('courseId'));
    this.courseId = this.courses.some(course => course.id === requested)
      ? requested
      : this.courses[0]?.id ?? null;
    if (this.courseId) this.loadTopics();
  }

  loadTopics(page = 1): void {
    if (!this.courseId) return;
    this.loading = true;
    this.selected = null;
    this.forum.getPosts(this.courseId, page).subscribe({
      next: response => {
        if (response.success) {
          this.topics = response.data.items;
          this.totalRecords = response.data.totalRecords;
          this.page = response.data.page;
        }
        this.loading = false;
      },
      error: error => {
        this.error = error.error?.message ?? 'تعذر تحميل المنتدى.';
        this.loading = false;
      },
    });
  }

  createTopic(): void {
    if (!this.courseId || !this.title.trim() || !this.content.trim()) return;
    this.forum.createPost(this.courseId, {
      title: this.title,
      content: this.content,
    }).subscribe({
      next: () => {
        this.title = '';
        this.content = '';
        this.loadTopics(1);
      },
      error: error => this.error = error.error?.message ?? 'تعذر نشر الموضوع.',
    });
  }

  open(topic: ForumPost): void {
    this.forum.getPost(topic.id).subscribe({
      next: response => {
        if (response.success) this.selected = response.data;
      },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل الموضوع.',
    });
  }

  addReply(): void {
    if (!this.selected || !this.reply.trim()) return;
    this.forum.replyToPost(this.selected.id, this.reply).subscribe({
      next: () => {
        this.reply = '';
        this.open(this.selected!);
      },
      error: error => this.error = error.error?.message ?? 'تعذر إضافة الرد.',
    });
  }

  removeTopic(topic: ForumPost): void {
    if (!confirm('حذف الموضوع؟')) return;
    this.forum.deletePost(topic.id).subscribe({
      next: () => this.loadTopics(this.page),
      error: error => this.error = error.error?.message ?? 'تعذر الحذف.',
    });
  }

  editTopic(topic: ForumPost): void {
    const title = prompt('عنوان الموضوع', topic.title);
    if (!title?.trim()) return;
    const content = prompt('محتوى الموضوع', topic.content);
    if (!content?.trim()) return;
    this.forum.updatePost(topic.id, { title, content }).subscribe({
      next: () => {
        this.loadTopics(this.page);
        this.open(topic);
      },
      error: error => this.error = error.error?.message ?? 'تعذر التعديل.',
    });
  }

  removeReply(reply: ForumReply): void {
    if (!confirm('حذف الرد؟')) return;
    this.forum.deleteReply(reply.id).subscribe({
      next: () => this.selected && this.open(this.selected),
      error: error => this.error = error.error?.message ?? 'تعذر الحذف.',
    });
  }

  editReply(reply: ForumReply): void {
    const content = prompt('نص الرد', reply.content);
    if (!content?.trim()) return;
    this.forum.updateReply(reply.id, content).subscribe({
      next: () => this.selected && this.open(this.selected),
      error: error => this.error = error.error?.message ?? 'تعذر التعديل.',
    });
  }

  report(target: 'topic' | 'reply', id: number): void {
    const reason = prompt('سبب الإبلاغ');
    if (!reason?.trim()) return;
    this.forum.report(target, id, reason).subscribe({
      next: () => alert('تم إرسال البلاغ للمراجعة.'),
      error: error => this.error = error.error?.message ?? 'تعذر إرسال البلاغ.',
    });
  }
}
