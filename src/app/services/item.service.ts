import { Injectable } from '@angular/core';
import {Item} from '../models/item.model';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {UIService} from './ui.service';
import {AppDataService} from './app-data.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class ItemService {
  itemsCollection: AngularFirestoreCollection<Item>;
  itemsDocument: AngularFirestoreDocument<Item>;
  item$: Observable<Item[]>;

  // tslint:disable-next-line:max-line-length
  constructor(public afs: AngularFirestore, private uiService: UIService, private appDataService: AppDataService, private snackBarRef: MatSnackBar) {
    this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('name', 'asc'));

    this.item$ = this.itemsCollection.snapshotChanges(['added', 'removed', 'modified']).pipe(
      map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Item;
          data.id = a.payload.doc.id;
          const uiSearch = this.uiService.hoverStatus.cards.item.filter(item => item.id === data.id);
          if (uiSearch.length === 0) { // If Card Is Not In UI Array
            this.uiService.hoverStatus.cards.item.push({
              id: data.id,
              card: false,
              borrowed: false,
            });
          }
          return data;
        });
      }));
  }

  getItems(): Observable<Item[]> { return this.item$; }

  addItem(item: Item) { this.itemsCollection.add(item); }

  updateItem(item: Item) {
    this.itemsDocument = this.afs.doc(`items/${item.id}`);
    this.itemsDocument.update(item);
  }

  deleteItem(item: Item) {
    this.itemsDocument = this.afs.doc(`items/${item.id}`);
    this.itemsDocument.delete();
    this.snackBarRef.open(`Item: ${item.name}, Has Been Removed!`, 'OK', {panelClass: ['notification-snackbar']});
  }

  overdueItem(items: Item[]) {
    for (const item of items) {
      if (item.stock !== 'Over') { // Has not already been set to overdue
        item.stock = 'Over';
        this.updateItem(item);
        this.snackBarRef.open(`Item: ${item.name}, Is Overdue!`, 'OK', {panelClass: ['notification-snackbar']});
      }
    }
  }

  borrowItem(item: Item, username: string) {
    this.appDataService.day = Number(Date.now());
    item.stock = 'Out';
    item.borrowed.push({
      user: username,
      checkout: this.appDataService.day,
      due: this.appDataService.day + (86400000 * 14), // 86400000 Epoch/Day
      return: null
    });
    this.updateItem(item);
    this.snackBarRef.open(`Item: ${item.name}, Has Been Borrowed!`, 'OK', {panelClass: ['notification-snackbar']});
  }

  checkInItem(item: Item) {
    this.appDataService.day = Number(Date.now());
    item.borrowed[item.borrowed.length - 1].return = this.appDataService.day;
    item.stock = 'In';
    this.updateItem(item);
    this.snackBarRef.open(`Item: ${item.name}, Has Been Returned!`, 'OK', {panelClass: ['notification-snackbar']});
  }
}

/*
this.itemService.addItem(
  {
    name: 'Book One',
    nameSearch: 'book one',
    type: 'Book',
    stock: 'In',
    sku: 'abc123',
    borrowed: []
  }
);

this.itemService.addItem(
  {
    name: 'AV One',
    nameSearch: 'av one',
    type: 'AV',
    stock: 'Out',
    sku: 'def456',
    borrowed: [
      {
        user: 'Thor',
        checkout: 1577923200000,
        due: 1579132800000,
        return: null
      }
    ]
  }
);

this.itemService.addItem(
  {
    name: 'Book Two',
    nameSearch: 'book two',
    type: 'Book',
    stock: 'Over',
    sku: 'ghi789',
    borrowed: [
      {
        user: 'Tony',
        checkout: 1573257600000,
        due: 1574467200000,
        return: 1574136499713
      },
      {
        user: 'Steve',
        checkout: 1576281600000,
        due: 1577491200000,
        return: null
      },
    ]
  }
);

this.itemService.addItem(
  {
    name: 'Book Three',
    nameSearch: 'book three',
    type: 'Book',
    stock: 'In',
    sku: 'jkl123',
    borrowed: [
      {
        user: 'Natasha',
        checkout: 1528934400000,
        due: 1530144000000,
        return: 1529889634721
      },
      {
        user: 'Clint',
        checkout: 1567296000000,
        due: 1568505600000,
        return: 1567979601483
      },
      {
        user: 'Loki',
        checkout: 1568851200000,
        due: 1570060800000,
        return: 1570060800000
      },
    ]
  }
);

this.itemService.addItem(
  {
    name: 'AV Two',
    nameSearch: 'av two',
    type: 'AV',
    stock: 'In',
    sku: 'mno456',
    borrowed: []
  }
);

this.itemService.addItem(
  {
    name: 'AV Three',
    nameSearch: 'av three',
    type: 'AV',
    stock: 'In',
    sku: 'pqr789',
    borrowed: [
      {
        user: 'Dr. Strange',
        checkout: 1458604800000,
        due: 1459814400000,
        return: 1458937558301
      }
    ]
  }
);

this.itemService.addItem(
  {
    name: 'Book Four',
    nameSearch: 'book four',
    type: 'Book',
    stock: 'Out',
    sku: 'stu123',
    borrowed: [
      {
        user: 'Thanos',
        checkout: 1578096000000,
        due: 1579305600000,
        return: null
      }
    ]
  }
);

this.itemService.addItem(
  {
    name: 'AV Four',
    nameSearch: 'av four',
    type: 'AV',
    stock: 'Out',
    sku: 'vwx456',
    borrowed: [
      {
        user: 'Peter Parker',
        checkout: 1576281600000,
        due: 1577491200000,
        return: null
      },
    ]
  }
);
*/

