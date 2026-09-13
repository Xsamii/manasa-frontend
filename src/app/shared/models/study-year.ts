export const STUDY_YEAR_VALUES = [
  '1st Preparatory',
  '2nd Preparatory',
  '3rd Preparatory',
  '1st Secondary',
  '2nd Secondary',
  '3rd Secondary',
] as const;

export type StudyYear = (typeof STUDY_YEAR_VALUES)[number];

export const STUDY_YEAR_LABELS: Record<StudyYear, string> = {
  '1st Preparatory': 'الصف الأول الإعدادي',
  '2nd Preparatory': 'الصف الثاني الإعدادي',
  '3rd Preparatory': 'الصف الثالث الإعدادي',
  '1st Secondary': 'الصف الأول الثانوي',
  '2nd Secondary': 'الصف الثاني الثانوي',
  '3rd Secondary': 'الصف الثالث الثانوي',
};

const LEGACY_STUDY_YEAR_LABELS: Record<string, string> = {
  '1st Primary': STUDY_YEAR_LABELS['1st Preparatory'],
  '2nd Primary': STUDY_YEAR_LABELS['2nd Preparatory'],
  '3rd Primary': STUDY_YEAR_LABELS['3rd Preparatory'],
};

export const STUDY_YEAR_OPTIONS = STUDY_YEAR_VALUES.map((value) => ({
  value,
  label: STUDY_YEAR_LABELS[value],
}));

export function studyYearLabel(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return STUDY_YEAR_LABELS[value as StudyYear] ?? LEGACY_STUDY_YEAR_LABELS[value] ?? value;
}
