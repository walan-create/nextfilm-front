import { OrderByPipe } from './order-by.pipe';

describe('OrderByPipe', () => {
  let pipe: OrderByPipe;

  beforeEach(() => {
    pipe = new OrderByPipe();
  });

  it('should sort array by field in ascending order', () => {
    const data = [
      { title: 'B' },
      { title: 'C' },
      { title: 'A' }
    ];
    const result = pipe.transform(data, 'title', 'asc');
    expect(result.map(r => r.title)).toEqual(['A', 'B', 'C']);
  });

  it('should sort array by field in descending order', () => {
    const data = [
      { title: 'B' },
      { title: 'C' },
      { title: 'A' }
    ];
    const result = pipe.transform(data, 'title', 'desc');
    expect(result.map(r => r.title)).toEqual(['C', 'B', 'A']);
  });

  it('should return same array if not array or field missing', () => {
    expect(pipe.transform(null as any, 'title')).toBeNull();
    expect(pipe.transform([], null as any)).toEqual([]);
  });

  it('should return 0 when values are equal (no sorting change)', () => {
    const items = [
      { name: 'Item A', value: 10 },
      { name: 'Item B', value: 10 }, // mismo valor en 'value'
    ];

    const result = pipe.transform(items, 'value', 'asc');
    
    expect(result).toEqual([
      { name: 'Item A', value: 10 },
      { name: 'Item B', value: 10 },
    ]);
  });
});
