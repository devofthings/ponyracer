import { FromNowPipe } from './from-now.pipe';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

describe('FromNowPipe', () => {
  it('should transform the input', () => {
    // given a pipe
    const pipe = new FromNowPipe();

    // when transforming the date
    const date = '2020-02-18T08:02:00Z';
    const transformed = pipe.transform(date);

    // then we should have a formatted string
    expect(transformed)
      .withContext('The pipe should transform the date into a human string, using the `formatDistanceToNowStrict` function of date-fns')
      .toBe(formatDistanceToNowStrict(parseISO(date), { addSuffix: true }));
  });
});
