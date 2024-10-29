import { chunk } from 'lodash-es';
import { dayjs } from '@/plugins/dayjs';
import type { UrlLibrary } from '@/types/api/urlLibrary';

/**
 * 日付カラムのクラスを取得する
 * @param day
 * @param rowIndex
 * @returns
 */
export function getDateClass(day: number, rowIndex: number) {
  let dateClass = 'date';

  // 1行目かつ日付が26日以上 or 5行目or6行目かつ日付が6日以下の場合、先来月の日付なので、クラスを追加
  if (
    (rowIndex === 0 && day >= 26) ||
    ((rowIndex === 4 || rowIndex === 5) && day <= 6)
  ) {
    dateClass += ' next-month';
  }

  return dateClass;
}

export type Weeks = [string, string, string, string, string, string, string][];

/**
 * 日付からカレンダーの日付の配列を作成
 * @param ym - Y-m
 */
export function getWeeks(ym: string): Weeks {
  const date = dayjs(ym, 'YYYY-MM');
  const startOfMonth = date.startOf('month').startOf('week'); // 月の開始日の週の日曜日を取得
  const endOfMonth = date.endOf('month').endOf('week'); // 月の最終日の週の土曜日を取得
  const dates: string[] = [];

  for (
    let d = startOfMonth;
    d.isBefore(endOfMonth) || d.isSame(endOfMonth);
    d = d.add(1, 'day')
  ) {
    dates.push(d.format('YYYY/MM/DD'));
  }

  // 一週間（7日）ごとに配列へ
  return chunk(dates, 7) as Weeks;
}

/**
 * カレンダー表示用に、UrlLibraryのデータを週ごとに分割する
 * @param weeks
 * @param data
 */
export function splitCalendarDataByWeek(
  weeks: Weeks,
  urlLibraries: UrlLibrary[],
): UrlLibrary[][][] {
  const result = [];

  // 一週間ごとにループ
  for (const week of weeks) {
    const weekData: UrlLibrary[][] = [];

    // 一日ごとにループ
    for (const day of week) {
      const dayData = urlLibraries.filter((urlLibrary) => {
        return day === dayjs(urlLibrary.createdAt).format('YYYY/MM/DD');
      });

      if (dayData) {
        weekData.push(dayData);
      } else {
        weekData.push([]);
      }
    }

    result.push(weekData);
  }

  return result;
}
