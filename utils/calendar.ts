import { chunk } from 'lodash-es';
import { dayjs } from '@/plugins/dayjs';
import type { UrlLibrary } from '@/types/api/urlLibrary';

/**
 * 日付カラムのクラスを取得する
 * @param day
 * @param rowIndex
 * @returns
 */
export function getDateClass(day: number, recordIndex: number) {
  // 他月の日付に対するクラスを追加
  if (recordIndex === 0 && day > 20) {
    return 'another-month'; // 先月
  } else if (recordIndex >= 4 && day < 15) {
    return 'another-month'; // 来月
  }

  return '';
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
