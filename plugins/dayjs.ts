import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/ja';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.locale('ja');

export { dayjs };

export default defineNuxtPlugin(() => {
  const formatDateTime = (date: string, option?: 'withWeekday') => {
    if (option === 'withWeekday') {
      return dayjs(date).format('YYYY/MM/DD (ddd)');
    }

    return dayjs(date).format('YYYY/MM/DD');
  };

  return {
    provide: {
      dayjs,
      formatDateTime,
    },
  };
});
