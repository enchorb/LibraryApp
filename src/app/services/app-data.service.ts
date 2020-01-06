import {Injectable} from '@angular/core';
import {Item} from '../models/item.model';

@Injectable()
export class AppDataService {
  searchFilter = {
    name: null,
    type: null,
    stock: null
  };

  day = null;

  items: Item[];

  constructor() {}
}
