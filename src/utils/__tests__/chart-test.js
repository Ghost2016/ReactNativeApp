import { getStringLength } from '../chart';


describe('图表中计算字符长度', () => {
  test('“职么开门APP”的长度为11', () => {
    expect(getStringLength('职么开门APP')).toEqual(11);
  });
});
