/* @flow */
// import type { ThemeType } from '../types';

// export default (backgroundColor: string, theme: ThemeType): string =>
export default (backgroundColor: string, theme): string =>
  backgroundColor === 'transparent' ? (theme === 'night' ? '#212D3B' : 'white') : backgroundColor;
