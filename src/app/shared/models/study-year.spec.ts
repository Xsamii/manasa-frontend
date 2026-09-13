import { studyYearLabel } from './study-year';

describe('studyYearLabel', () => {
  it('translates preparatory and secondary years to Arabic', () => {
    expect(studyYearLabel('1st Preparatory')).toBe('الصف الأول الإعدادي');
    expect(studyYearLabel('2nd Secondary')).toBe('الصف الثاني الثانوي');
  });

  it('maps leftover primary values to preparatory labels', () => {
    expect(studyYearLabel('3rd Primary')).toBe('الصف الثالث الإعدادي');
  });

  it('returns the original value when it is unknown', () => {
    expect(studyYearLabel('year1')).toBe('year1');
    expect(studyYearLabel('')).toBe('');
  });
});
