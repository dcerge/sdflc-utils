import { dataTimeHelpers, DateTimeHelpers } from '../';

describe('dataTimeHelpers tests', () => {
  const dateStr = '2021-05-30T12:00:00Z';
  const date = new Date(dateStr);

  test('getYearMonthDay', () => {
    expect(dataTimeHelpers.getYearMonthDay(date)).toEqual({
      year: 2021,
      month: 5,
      day: 30,
    });
  });

  test('createStartPeriod', () => {
    expect(dataTimeHelpers.createStartPeriod({ year: 2021, month: 5, day: 31 })).toEqual(
      new Date('2021-05-31T00:00:00.000Z'),
    );
  });

  test('createEndPeriod', () => {
    expect(dataTimeHelpers.createEndPeriod({ year: 2021, month: 5, day: 31 })).toEqual(
      new Date('2021-05-31T23:59:59.999Z'),
    );
  });

  test('createPeriod MTD', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.MTD, dateStr)).toEqual({
      startDate: new Date('2021-05-01T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createPeriod QTD', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.QTD, dateStr)).toEqual({
      startDate: new Date('2021-04-01T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createPeriod YTD', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.YTD, dateStr)).toEqual({
      startDate: new Date('2021-01-01T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createPeriod L1M', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.L1M, dateStr)).toEqual({
      startDate: new Date('2021-04-30T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createPeriod L3M', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.L3M, dateStr)).toEqual({
      startDate: new Date('2021-02-28T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createPeriod L6M', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.L6M, dateStr)).toEqual({
      startDate: new Date('2020-11-30T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createPeriod L12M', () => {
    expect(dataTimeHelpers.createPeriod(DateTimeHelpers.PeriodTypes.L12M, dateStr)).toEqual({
      startDate: new Date('2020-05-30T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createRangePeriod', () => {
    expect(
      dataTimeHelpers.createRangePeriod('2020-05-01T00:00:00.000Z', '2021-05-30T23:59:59.999Z', { utc: true }),
    ).toEqual({
      startDate: new Date('2020-05-01T00:00:00.000Z'),
      endDate: new Date('2021-05-30T23:59:59.999Z'),
    });
  });

  test('createRangePeriodLastYear', () => {
    expect(
      dataTimeHelpers.createRangePeriodLastYear('2021-01-01T00:00:00.000Z', '2021-12-31T23:59:59.999Z', { utc: true }),
    ).toEqual({
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2020-12-31T23:59:59.999Z'),
    });
  });

  test('createYearPeriod', () => {
    expect(dataTimeHelpers.createYearPeriod(2021)).toEqual({
      startDate: new Date('2021-01-01T00:00:00.000Z'),
      endDate: new Date('2021-12-31T23:59:59.999Z'),
    });
  });

  test('getMonthName', () => {
    expect(dataTimeHelpers.getMonthName(0)).toEqual('Jan.');
    expect(dataTimeHelpers.getMonthName(1)).toEqual('Feb.');
    expect(dataTimeHelpers.getMonthName(11)).toEqual('Dec.');
  });
});
