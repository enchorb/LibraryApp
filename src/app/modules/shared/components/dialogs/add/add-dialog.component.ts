import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UIService } from '../../../../../services/ui.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Item } from '../../../../../models/item.model';
import {ItemService} from '../../../../../services/item.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {debounceTime, map, take} from 'rxjs/operators';
type ItemType = 'AV' | 'Book';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit, OnDestroy {
  addForm: FormGroup;

  @HostBinding('attr.style')
  get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`
      --av-fab-shadow: ${this.uiService.addForm.av.shadow};
      --av-fab-background: ${this.uiService.addForm.av.background};
      --av-fab-cursor: ${this.uiService.addForm.av.cursor};
      --av-fill: ${this.uiService.addForm.av.fill};
      --av-fill-hover: ${this.uiService.addForm.av.hoverFill};
      --book-fab-shadow: ${this.uiService.addForm.book.shadow};
      --book-fab-background: ${this.uiService.addForm.book.background};
      --book-fab-cursor: ${this.uiService.addForm.book.cursor};
      --book-fill: ${this.uiService.addForm.book.fill};
      --book-fill-hover: ${this.uiService.addForm.book.hoverFill};
      `);
  }

  // tslint:disable-next-line:max-line-length
  constructor(private dialogRef: MatDialogRef<AddDialogComponent>, private fb: FormBuilder, private sanitizer: DomSanitizer, private afs: AngularFirestore, public uiService: UIService) {
    this.addForm = fb.group({
      // tslint:disable-next-line:max-line-length
      name: new FormControl(null, [Validators.required, Validators.nullValidator, Validators.pattern('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')], [NameExistsValidator.itemname(this.afs)]),
      // tslint:disable-next-line:max-line-length
      sku: new FormControl(null, [Validators.required, Validators.nullValidator, Validators.pattern('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$'), Validators.minLength(6), Validators.maxLength(12)], [SKUExistsValidator.itemsku(this.afs)]),
      type: new FormControl(null, [Validators.required, Validators.nullValidator])
    });
  }

  ngOnInit() { this.addForm.reset(); }

  ngOnDestroy() {
    this.uiService.addForm.av.shadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
    this.uiService.addForm.av.background = '#f6f6f6';
    this.uiService.addForm.av.cursor = 'pointer';
    this.uiService.addForm.av.fill = '#a5a5a5';
    this.uiService.addForm.av.hoverFill = '#00aaef';
    this.uiService.addForm.book.shadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
    this.uiService.addForm.book.background = '#f6f6f6';
    this.uiService.addForm.book.cursor = 'pointer';
    this.uiService.addForm.book.fill = '#a5a5a5';
    this.uiService.addForm.book.hoverFill = '#00aaef';
  }

  onHover(ev) {
    if (ev[0] != null) {
      if (ev[1][0] === 'closeBtn') { this.uiService.hoverStatus.addForm.buttons.close = ev[0]; }
      if (ev[1][0] === 'addBtn') { this.uiService.hoverStatus.addForm.buttons.add = ev[0]; }
      if (ev[1][0] === 'avBtn') { this.uiService.hoverStatus.addForm.buttons.av = ev[0]; }
      if (ev[1][0] === 'bookBtn') { this.uiService.hoverStatus.addForm.buttons.book = ev[0]; }
    }
  }

  onType(type: ItemType) {
    this.addForm.controls.type.setValue(type);
    if (type === 'Book') {
      this.uiService.addForm.book.shadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)';
      this.uiService.addForm.book.background = 'white';
      this.uiService.addForm.book.cursor = 'inherit';
      this.uiService.addForm.book.fill = '#00aaef';
      this.uiService.addForm.book.hoverFill = '#00aaef';
      this.uiService.addForm.av.shadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
      this.uiService.addForm.av.background = '#f6f6f6';
      this.uiService.addForm.av.cursor = 'pointer';
      this.uiService.addForm.av.fill = '#a5a5a5';
      this.uiService.addForm.av.hoverFill = '#00aaef';
    }
    if (type === 'AV') {
      this.uiService.addForm.av.shadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)';
      this.uiService.addForm.av.background = 'white';
      this.uiService.addForm.av.cursor = 'inherit';
      this.uiService.addForm.av.fill = '#00aaef';
      this.uiService.addForm.av.hoverFill = '#00aaef';
      this.uiService.addForm.book.shadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
      this.uiService.addForm.book.background = '#f6f6f6';
      this.uiService.addForm.book.cursor = 'pointer';
      this.uiService.addForm.book.fill = '#a5a5a5';
      this.uiService.addForm.book.hoverFill = '#00aaef';
    }
  }

  onClose() { this.addForm.reset(); this.dialogRef.close(); }

  onAdd() {
    const item: Item  = {
      name: this.addForm.controls.name.value,
      nameSearch: this.addForm.controls.name.value.toString().toLowerCase(),
      type: this.addForm.controls.type.value,
      stock: 'In',
      sku: this.addForm.controls.sku.value,
      borrowed: [],
    };
    this.dialogRef.close(item);
    this.addForm.reset();
  }
}

export class NameExistsValidator {
  static itemname(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const itemname = control.value.toString().toLowerCase();
      // tslint:disable-next-line:max-line-length
      return afs.collection('items', ref => ref.where('nameSearch', '==', itemname)).valueChanges().pipe( // Need to pipe since Firebase sends stream data and would never resolve
        debounceTime(500), // Wait for user to stop typing for 500ms before sending query
        take(1), // Make sure observable completes
        map(arr => arr.length ? {nameExists: false} : null) // If value matched in database set error key, else if no match send null
      );
    };
  }
}

export class SKUExistsValidator {
  static itemsku(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const itemsku = control.value;
      // tslint:disable-next-line:max-line-length
      return afs.collection('items', ref => ref.where('sku', '==', itemsku)).valueChanges().pipe( // Need to pipe since Firebase sends stream data and would never resolve
        debounceTime(500), // Wait for user to stop typing for 500ms before sending query
        take(1), // Make sure observable completes
        map(arr => arr.length ? {skuExists: false} : null) // If value matched in database set error key, else if no match send null
      );
    };
  }
}
