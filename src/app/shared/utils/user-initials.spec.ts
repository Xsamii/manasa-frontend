import { userInitials } from './user-initials';

describe('userInitials', () => {
  it('uses the first and last name letters', () => {
    expect(userInitials('سارة علي')).toBe('سع');
  });

  it('falls back when the name is missing', () => {
    expect(userInitials('')).toBe('?');
  });
});
