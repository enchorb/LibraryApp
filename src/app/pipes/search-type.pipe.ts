import { Pipe, PipeTransform } from '@angular/core';
import {Item} from '../models/item.model';
type ItemType = 'AV' | 'Book';

@Pipe({
  name: 'searchType'
})
export class SearchTypePipe implements PipeTransform {
  transform(items: Item[], typeSearch?: ItemType): Item[] {
    if (!items) { return []; } // If No Items
    if (!typeSearch) { return items; }
    items = items.filter(item => item.type.includes(typeSearch));
    return items;
  }
}

