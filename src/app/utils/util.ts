export class Util {
  public static isNullOrUndefined(s: any): boolean {
    if (s instanceof Array || typeof s === 'string') {
      return s === null || s === undefined || s.length === 0;
    }
    return s === null || s === undefined;
  }


  public static multiply(val1: number, val2: number) {
    const commonMultiplier = 1000000;
    val1 *= commonMultiplier;
    val2 *= commonMultiplier;
    return (val1 * val2) / (commonMultiplier * commonMultiplier);
  }

  public static readFilters(filters: any): any {
    const result: any = {};
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const filter: { value: string, matchMode: string } = filters[key];
        result[key] = filter.value;
      }
    }
    return result;
  }
}
