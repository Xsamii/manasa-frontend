import { Pipe, PipeTransform } from '@angular/core';
import { studyYearLabel } from '../models/study-year';

@Pipe({
  name: 'studyYear',
  standalone: true,
})
export class StudyYearPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return studyYearLabel(value);
  }
}
