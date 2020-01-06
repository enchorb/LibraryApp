import { Pipe, PipeTransform } from '@angular/core';
import {Item} from '../models/item.model';

@Pipe({
  name: 'searchName'
})
export class SearchNamePipe implements PipeTransform {
  transform(items: Item[], nameSearch?: string): Item[] {
    if (!items) { return []; } // If No Items
    if (!nameSearch) { return items; }
    items = items.filter(item => item.name.toString().toLowerCase().includes(nameSearch.toString().toLowerCase()));
    return items;
  }
}

