import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {ItemService} from './services/item.service';
import {AppDataService} from './services/app-data.service';
import {UIService} from './services/ui.service';
import {MatDialog} from '@angular/material';
import {HistoryDialogComponent} from './modules/shared/components/dialogs/history/history-dialog.component';
import {Item} from './models/item.model';
import {AddDialogComponent} from './modules/shared/components/dialogs/add/add-dialog.component';
import {CheckoutDialogComponent} from './modules/shared/components/dialogs/checkout/checkout-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  /*
  TO DO:
    - Fix Search Cross Animation To None
    - Async Loading
   */

  searchForm: FormGroup; dateInterval;

  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  onHover(ev) {
    if (ev[0] != null) {
      if (ev[1][0] === 'searchBar') { this.uiService.hoverStatus.searchBar = ev[0]; }
      if (ev[1][0] === 'cross') { this.uiService.hoverStatus.searchBarIcons.cross = ev[0]; }
      if (ev[1][0] === 'stock') { this.uiService.hoverStatus.searchBarIcons.stock = ev[0]; }
      if (ev[1][0] === 'type') { this.uiService.hoverStatus.searchBarIcons.type = ev[0]; }
      if (ev[1][0] === 'add') { this.uiService.hoverStatus.fabIcons.add = ev[0]; }
      if (ev[1][0] === 'cart') { this.uiService.hoverStatus.fabIcons.cart = ev[0]; }
      if (ev[1][0] === 'itemCards') { this.uiService.hoverStatus.cards.item[ev[1][1]].card = ev[0]; }
      if (ev[1][0] === 'itemCardsBorrowed') { this.uiService.hoverStatus.cards.item[ev[1][1]].borrowed = ev[0]; }
    }
  }

  @HostBinding('attr.style')
  get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`
      --stock-fill-hover: ${this.uiService.searchBar.stock.hoverFill};
      --stock-fill: ${this.uiService.searchBar.stock.fill};
      --type-fill: ${this.uiService.searchBar.type.fill};
      `);
  }

  // tslint:disable-next-line:max-line-length
  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder, private dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              public appDataService: AppDataService, public itemService: ItemService, public uiService: UIService
  ) {
    this.searchForm = fb.group({
      search: new FormControl(null, [Validators.required, Validators.nullValidator]),
    });
    this.searchForm.valueChanges.subscribe(data => this.appDataService.searchFilter.name = data.search);
  }

  ngOnInit() {
    this.itemService.getItems().subscribe(item => {
      this.appDataService.items = item;
      this.changeDetectorRef.detectChanges();
    });

    this.dateInterval = setInterval(() => {
      this.appDataService.day = Number(Date.now()); // 86400000 Epoch/Day
      let overdueItems: Item[];
      overdueItems = this.appDataService.items.filter(item => {
        if (item.stock !== 'In') {
          // tslint:disable-next-line:max-line-length
          if ((this.appDataService.day > item.borrowed[item.borrowed.length - 1].due) && (item.borrowed[item.borrowed.length - 1].return == null)) {
            return item;
          }
        }
      });
      this.itemService.overdueItem(overdueItems);
    }, 300000); // 300000 - Update Every 5 Minutes
  }

  ngOnDestroy() {
    if (this.dateInterval) { clearInterval(this.dateInterval); }
  }

  onCross() { this.searchForm.reset(); }

  onType() {
    switch (this.uiService.clickTrack.searchBarIcons.type) {
      case (0):
        this.appDataService.searchFilter.type = 'Book';
        this.uiService.clickTrack.searchBarIcons.type++;
        this.uiService.searchBar.type.svg = this.uiService.svgIcons.book;
        this.uiService.searchBar.type.tooltip = 'Books'; this.uiService.searchBar.type.fill = '#00aaef';
        break;
      case (1):
        this.appDataService.searchFilter.type = 'AV';
        this.uiService.clickTrack.searchBarIcons.type++;
        this.uiService.searchBar.type.svg = this.uiService.svgIcons.av;
        this.uiService.searchBar.type.tooltip = 'AV Equipment'; this.uiService.searchBar.type.fill = '#00aaef';
        break;
      case (2):
        this.appDataService.searchFilter.type = null;
        this.uiService.clickTrack.searchBarIcons.type = 0;
        this.uiService.searchBar.type.svg = this.uiService.svgIcons.filter;
        this.uiService.searchBar.type.tooltip = 'Filter By Item Type'; this.uiService.searchBar.type.fill = '#a5a5a5';
        break;
      default:
        this.appDataService.searchFilter.type = null;
        this.uiService.clickTrack.searchBarIcons.type = 0;
        this.uiService.searchBar.type.svg = this.uiService.svgIcons.filter;
        this.uiService.searchBar.type.tooltip = 'Filter By Item Type'; this.uiService.searchBar.type.fill = '#a5a5a5';
        break;
    }
  }

  onStock() {
    switch (this.uiService.clickTrack.searchBarIcons.stock) {
      case (0):
        this.appDataService.searchFilter.stock = 'In';
        this.uiService.clickTrack.searchBarIcons.stock++;
        this.uiService.searchBar.stock.svg = this.uiService.svgIcons.btnChecked;
        this.uiService.searchBar.stock.tooltip = 'In Stock';
        this.uiService.searchBar.stock.fill = '#37ff2f'; this.uiService.searchBar.stock.hoverFill = '#37ff2f';
        break;
      case (1):
        this.appDataService.searchFilter.stock = 'Out';
        this.uiService.clickTrack.searchBarIcons.stock++;
        this.uiService.searchBar.stock.svg = this.uiService.svgIcons.btnChecked;
        this.uiService.searchBar.stock.tooltip = 'Borrowed';
        this.uiService.searchBar.stock.fill = '#ff752d'; this.uiService.searchBar.stock.hoverFill = '#ff752d';
        break;
      case (2):
        this.appDataService.searchFilter.stock = 'Over';
        this.uiService.clickTrack.searchBarIcons.stock++;
        this.uiService.searchBar.stock.svg = this.uiService.svgIcons.btnChecked;
        this.uiService.searchBar.stock.tooltip = 'Overdue';
        this.uiService.searchBar.stock.fill = '#ff171a'; this.uiService.searchBar.stock.hoverFill = '#ff171a';
        break;
      case (3):
        this.appDataService.searchFilter.stock = null;
        this.uiService.clickTrack.searchBarIcons.stock = 0;
        this.uiService.searchBar.stock.svg = this.uiService.svgIcons.btnUnchecked;
        this.uiService.searchBar.stock.tooltip = 'Filter By Stock';
        this.uiService.searchBar.stock.fill = '#a5a5a5'; this.uiService.searchBar.stock.hoverFill = '#00aaef';
        break;
      default:
        this.appDataService.searchFilter.stock = null;
        this.uiService.clickTrack.searchBarIcons.stock = 0;
        this.uiService.searchBar.stock.svg = this.uiService.svgIcons.btnUnchecked;
        this.uiService.searchBar.stock.tooltip = 'Filter By Stock';
        this.uiService.searchBar.stock.fill = '#a5a5a5'; this.uiService.searchBar.stock.hoverFill = '#00aaef';
        break;
    }
  }

  onHistory(item: Item, i: number) {
    const historyDialogRef = this.dialog.open(HistoryDialogComponent, {
      data: item,
      width: 'fit-content',
      height: 'fit-content',
      autoFocus: false,
      disableClose: false
    });
    historyDialogRef.afterOpened().subscribe(data => {
      this.uiService.hoverStatus.cards.item[i].borrowed = true;
    });
    historyDialogRef.afterClosed().subscribe(data => {
      this.uiService.hoverStatus.cards.item[i].borrowed = false;
    });
  }

  onAdd() {
    const addDialogRef = this.dialog.open(AddDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      autoFocus: false,
      disableClose: true
    });
    addDialogRef.afterOpened().subscribe(x => {
      this.uiService.hoverStatus.fabIcons.add = true;
    });
    addDialogRef.afterClosed().subscribe(item => {
      this.uiService.hoverStatus.fabIcons.add = false;
      if (item) { this.itemService.addItem(item); }
    });
  }

  onCart() {
    const checkoutDialogRef = this.dialog.open(CheckoutDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      autoFocus: false,
      disableClose: true
    });
    checkoutDialogRef.afterOpened().subscribe(x => {
      this.uiService.hoverStatus.fabIcons.cart = true;
    });
    checkoutDialogRef.afterClosed().subscribe(x => {
      this.uiService.hoverStatus.fabIcons.cart = false;
    });
  }

  onUpdate(item: Item, i: number) {
    let updateItem: Item;
    switch (item.stock) {
      case 'In':
        break;
      case 'Out':
      case 'Over':
        updateItem = {...item};
        this.itemService.checkInItem(updateItem);
        break;
      default:
        break;
    }
  }

  onDelete(item: Item, i: number) {
    this.itemService.deleteItem(item);
    this.uiService.hoverStatus.cards.item.splice(i, 1);
  }
}
