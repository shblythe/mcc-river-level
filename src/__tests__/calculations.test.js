import { calcMccHeight, calcTrend } from '../lib/calculations';
import { NorthEast, SouthEast, East } from '@mui/icons-material';

test('calculates correct height with both sources zero', () => {
    expect(calcMccHeight(0.0, 0.0)).toBeCloseTo(0.0);
});

test('calculates correct height with Marple Bridge zero', () => {
    expect(calcMccHeight(0.0, 0.1)).toBeCloseTo(0.6);
    expect(calcMccHeight(0.0, 0.2)).toBeCloseTo(0.76);
    expect(calcMccHeight(0.0, 0.3)).toBeCloseTo(1.64);
    expect(calcMccHeight(0.0, 0.5)).toBeCloseTo(3.4);
    expect(calcMccHeight(0.0, 1.0)).toBeCloseTo(7.8);
    expect(calcMccHeight(0.0, 1.3)).toBeCloseTo(10.44);
    expect(calcMccHeight(0.0, 1.5)).toBeCloseTo(12.2);
});

test('calculates correct height with Compstall zero', () => {
    expect(calcMccHeight(0.1, 0.0)).toBeCloseTo(0.6);
    expect(calcMccHeight(0.2, 0.0)).toBeCloseTo(0.86);
    expect(calcMccHeight(0.3, 0.0)).toBeCloseTo(1.74);
    expect(calcMccHeight(0.5, 0.0)).toBeCloseTo(3.5);
    expect(calcMccHeight(1.0, 0.0)).toBeCloseTo(7.9);
    expect(calcMccHeight(1.3, 0.0)).toBeCloseTo(10.54);
    expect(calcMccHeight(1.5, 0.0)).toBeCloseTo(12.3);
});

test('calculates correct height with arbitrary values', () => {
    expect(calcMccHeight(0.1, 0.1)).toBeCloseTo(1.2);
    expect(calcMccHeight(0.2, 0.2)).toBeCloseTo(1.62);
    expect(calcMccHeight(1.5, 1.5)).toBeCloseTo(24.5);
    expect(calcMccHeight(1.2, 0.6)).toBeCloseTo(13.94);
    expect(calcMccHeight(0.6, 1.2)).toBeCloseTo(13.94);
    expect(calcMccHeight(0.6, 0.4)).toBeCloseTo(6.9);
    expect(calcMccHeight(0.9, 1.2)).toBeCloseTo(16.58);
    expect(calcMccHeight(0.9, 0.5)).toBeCloseTo(10.42);
    expect(calcMccHeight(0.2, 0.4)).toBeCloseTo(3.38);
    expect(calcMccHeight(0.9, 1.1)).toBeCloseTo(15.7);
});

test('calculates correct trend strings', () => {
    const up = <NorthEast/>;
    const down = <SouthEast/>;
    const steady = <East/>;

    expect(calcTrend(0.0, 0.1)).toEqual(down);
    expect(calcTrend(0.1, 0.0)).toEqual(up);
    expect(calcTrend(0.1, 0.1)).toEqual(steady);
    expect(calcTrend(10.0, 2.0)).toEqual(up);
    expect(calcTrend(1.001, 1.002)).toEqual(down);
    expect(calcTrend(5.5555, 5.5555)).toEqual(steady);
});

