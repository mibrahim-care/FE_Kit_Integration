import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'age' })
export class AgePipe implements PipeTransform {
  transform(birthDate: string | undefined | null, today: Date = new Date()): number | null {
    if (!birthDate) {
      return null;
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    let age = today.getFullYear() - year;
    const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= (day ?? 1));
    if (!hadBirthday) {
      age--;
    }
    return age;
  }
}
