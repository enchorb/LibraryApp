import { Pipe, PipeTransform } from '@angular/core';
import {Item} from '../models/item.model';
type ItemStock = 'In' | 'Out' | 'Over';

@Pipe({
  name: 'searchStock'
})
export class SearchStockPipe implements PipeTransform {
  transform(items: Item[], stockSearch?: ItemStock): Item[] {
    if (!items) { return []; } // If No Items
    if (!stockSearch) { return items; }
    items = items.filter(item => item.stock.includes(stockSearch));
    return items;
  }
}

