import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  generateYearsArray(startYear: number, endYear: number): any[] {
    const years: any[] = [];
    for (let year = startYear; year >= endYear; year--) {
      years.push({ key: year, value: year });
    }
    return years;
  }
}
