import { isToday, timeOnly, formattedDateFromString } from '../lib/datetime.js'

test('recognises current date/time as today', () => { 
    const now = new Date();
    expect(isToday(now)).toEqual(true);
});

test('recognises 00:00:00 on current day as today', () => {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    expect(isToday(now)).toEqual(true);
});

test('recognises 23:59:59 on current day as today', () => {
    const now = new Date();
    now.setHours(23);
    now.setMinutes(59);
    now.setSeconds(59);
    expect(isToday(now)).toEqual(true);
});

test('recognises that 23:59:59 yesterday is not today', () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    expect(isToday(date)).toEqual(false);
});

test('recognises that 00:00:00 tomorrow is not today', () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    expect(isToday(date)).toEqual(false);
});

test('correctly converts 11:37 today to a valid 24h clock string', () => {
    const date = new Date();
    date.setHours(11);
    date.setMinutes(37);
    date.setSeconds(45);
    expect(timeOnly(date)).toEqual("11:37");
});

test('correctly converts 09:00 today to a valid 24h clock string', () => {
    const date = new Date();
    date.setHours(9);
    date.setMinutes(0);
    date.setSeconds(11);
    expect(timeOnly(date)).toEqual("09:00");
});

test('correctly converts 18:01 today to a valid 24h clock string', () => {
    const date = new Date();
    date.setHours(18);
    date.setMinutes(1);
    date.setSeconds(11);
    expect(timeOnly(date)).toEqual("18:01");
});

test('correctly converts 00:00 today to a valid 24h clock string', () => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    expect(timeOnly(date)).toEqual("00:00");
});

test('correctly converts 23:59 today to a valid 24h clock string', () => {
    const date = new Date();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    expect(timeOnly(date)).toEqual("23:59");
});

