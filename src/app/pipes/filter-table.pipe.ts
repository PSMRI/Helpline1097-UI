import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'filterTable' })
export class FilterTable implements PipeTransform {
    transform(array: any[], query: string): any {
        if (query) {
            if (typeof parseInt(query, 10) === 'number') {
                return array.filter((value: any, index: number, arr: any) =>
                    value.indexOf(query) > -1);
            } else {
                query = query.toLowerCase();
                return array.filter((value: any, index: number, arr: any) =>
                    value.name.toLowerCase().indexOf(query) > -1);
            }
        }
        return array;
    }
}
