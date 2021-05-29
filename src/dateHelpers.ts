import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs/plugin/utc';
import { padStart } from 'lodash';

dayjs.extend(dayjsPluginUTC);

const PERIOD_TYPES: any = {
  CURRENT: 'CURRENT', // Selected Date
  MTD: 'MTD', // Month To Date
  QTD: 'QTD', // Quarter To Date
  YTD: 'YTD', // Year To Date
  L1M: 'L1M', // Last 3 Months
  L3M: 'L3M', // Last 3 Months
  L6M: 'L6M', // Last 6 Months
  L12M: 'L12M', // Last 12 Months
  MONTH: 'MONTH', // 1 - 30/31
  YEAR: 'YEAR', // Jan 1 - Dec 31
};

class DateTimeHelpers {
  static PeriodTypes = PERIOD_TYPES;

  dbFormat(date: Date) {
    return dayjs
      .utc()
      .year(date.getUTCFullYear())
      .month(date.getUTCMonth())
      .date(date.getUTCDate())
      .hour(date.getUTCHours())
      .minute(date.getUTCMinutes())
      .second(date.getUTCSeconds())
      .format();
  }

  dbUtcNow() {
    return dayjs.utc().format();
  }

  getYearMonthDay(dttm: Date, opt?: any) {
    if (!opt) {
      opt = {};
    }

    const isUtc = opt.utc === true;

    return {
      year: isUtc ? dttm.getUTCFullYear() : dttm.getFullYear(),
      month: isUtc ? dttm.getUTCMonth() + 1 : dttm.getMonth() + 1,
      day: isUtc ? dttm.getUTCDate() : dttm.getDate(),
    };
  }

  createStartPeriod(args: any) {
    const { year, month, day } = args || {};
    return new Date(`${year}-${padStart(month, 2, '0')}-${padStart(day, 2, '0')}T00:00:00.000Z`);
  }

  createEndPeriod(args: any) {
    const { year, month, day } = args || {};
    return new Date(`${year}-${padStart(month, 2, '0')}-${padStart(day, 2, '0')}T23:59:59.999Z`);
  }

  formatPeriod(period: any, opt: any) {
    if (!opt) {
      opt = {};
    }

    return opt.format
      ? {
          startDate: this.dbFormat(period.startDate),
          endDate: this.dbFormat(period.endDate),
        }
      : period;
  }

  /**
   * Creates a perdio from start datetime to end datetime accroding to specified period and provided date.
   * @param {string} periodType One of values from PERIOD_TYPES
   * @param {string} date a date in the YYYY-MM-DD format
   * @returns {object} returns an object { startDate, endDate }
   */
  createPeriod(periodType: string, date: string, opt?: any) {
    const period2chk = (periodType || '').toUpperCase();

    if (!PERIOD_TYPES[period2chk]) {
      return null;
    }

    if (!opt) {
      opt = {};
    }

    const dttm = dayjs(date);
    const today = this.getYearMonthDay(dttm.toDate(), opt);
    const period: any = {
      startDate: null,
      endDate: null,
    };

    switch (period2chk) {
      default:
      case PERIOD_TYPES.CURRENT:
        period.startDate = this.createStartPeriod(today);
        period.endDate = this.createEndPeriod(today);
        break;

      case PERIOD_TYPES.MTD:
        period.startDate = this.createStartPeriod({ ...today, day: 1 });
        period.endDate = this.createEndPeriod(today);
        break;

      case PERIOD_TYPES.QTD:
        {
          const qMonth = 3 * (Math.ceil(+today.month / 3) - 1) + 1;
          period.startDate = this.createStartPeriod({ ...today, month: qMonth, day: 1 });
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.YTD:
        period.startDate = this.createStartPeriod({ ...today, month: 1, day: 1 });
        period.endDate = this.createEndPeriod(today);
        break;

      case PERIOD_TYPES.MONTH:
        {
          const tmpDate = new Date(today.year, +today.month, 0);
          period.startDate = this.createStartPeriod({ ...today, day: 1 });
          period.endDate = this.createEndPeriod({ ...today, day: tmpDate.getDate() });
        }
        break;

      case PERIOD_TYPES.YEAR:
        period.startDate = this.createStartPeriod({ ...today, month: 1, day: 1 });
        period.endDate = this.createEndPeriod({ ...today, month: 12, day: 31 });
        break;

      case PERIOD_TYPES.L1M:
        {
          period.startDate = this.createStartPeriod(this.getYearMonthDay(dttm.add(-1, 'months').toDate(), opt));
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L3M:
        {
          period.startDate = this.createStartPeriod(this.getYearMonthDay(dttm.add(-3, 'months').toDate(), opt));
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L6M:
        {
          period.startDate = this.createStartPeriod(this.getYearMonthDay(dttm.add(-6, 'months').toDate(), opt));
          period.endDate = this.createEndPeriod(today);
        }
        break;

      case PERIOD_TYPES.L12M:
        {
          period.startDate = this.createStartPeriod(this.getYearMonthDay(dttm.add(-12, 'months').toDate(), opt));
          period.endDate = this.createEndPeriod(today);
        }
        break;
    }

    return this.formatPeriod(period, opt);
  }

  createRangePeriod(startDate: string, endDate: string, opt?: any) {
    const period = {
      startDate: this.createStartPeriod(this.getYearMonthDay(dayjs(startDate).toDate(), opt)),
      endDate: this.createEndPeriod(this.getYearMonthDay(dayjs(endDate).toDate(), opt)),
    };

    return this.formatPeriod(period, opt);
  }

  createRangePeriodLastYear(startDate: string, endDate: string, opt?: any) {
    const start = this.getYearMonthDay(dayjs(startDate).toDate(), opt);
    const end = this.getYearMonthDay(dayjs(endDate).toDate(), opt);

    const period = {
      startDate: this.createStartPeriod({ ...start, year: start.year - 1 }),
      endDate: this.createEndPeriod({ ...end, year: end.year - 1 }),
    };

    return this.formatPeriod(period, opt);
  }

  /**
   * Creates perdiod for specified year
   * @param {number} year A year to create a period for
   */
  createYearPeriod(year: number, opt?: any) {
    if (!opt) {
      opt = {};
    }

    const period = {
      startDate: new Date(`${year}-01-01T00:00:00.000Z`),
      endDate: new Date(`${year}-12-31T23:59:59.999Z`),
    };

    return opt.format
      ? {
          startDate: this.dbFormat(period.startDate),
          endDate: this.dbFormat(period.endDate),
        }
      : period;
  }

  /**
   * Returns month name on its number.
   * @param {number} monthNo 0 based month number
   */
  getMonthName(monthNo: number) {
    const dttm = new Date();

    dttm.setMonth(monthNo);

    return monthNo >= 0 && monthNo < 12
      ? dttm.toLocaleString('default', { month: 'short' })
      : `Invalid Month ${monthNo}`;
  }
}

const dataTimeHelpers = new DateTimeHelpers();

export { dataTimeHelpers, DateTimeHelpers };
