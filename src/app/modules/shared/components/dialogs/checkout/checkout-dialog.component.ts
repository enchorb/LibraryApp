import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UIService} from '../../../../../services/ui.service';
import {Item} from '../../../../../models/item.model';
import {ItemService} from '../../../../../services/item.service';
import {AppDataService} from '../../../../../services/app-data.service';

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.css']
})
export class CheckoutDialogComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CheckoutDialogComponent>, private snackBarRef: MatSnackBar, private fb: FormBuilder,
              public uiService: UIService, public itemService: ItemService, public appDataService: AppDataService
  ) {
    this.checkoutForm = fb.group({
      name: new FormControl(null, [Validators.required, Validators.nullValidator, Validators.pattern('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')]),
      // tslint:disable-next-line:max-line-length
      sku: new FormControl({value: null, disabled: true}, [Validators.required, Validators.nullValidator, Validators.pattern('^[a-zA-Z0-9]+([a-zA-Z0-9 ]+)*$')]),
     });
  }

  ngOnInit() { this.checkoutForm.reset(); }

  ngOnDestroy() { }

  onHover(ev) {
    if (ev[0] != null) {
      if (ev[1][0] === 'closeBtn') { this.uiService.hoverStatus.checkoutForm.buttons.close = ev[0]; }
      if (ev[1][0] === 'borrowBtn') { this.uiService.hoverStatus.checkoutForm.buttons.borrow = ev[0]; }
    }
  }

  onNameType() {
    switch (this.checkoutForm.controls.name.valid) {
      case true:
        this.checkoutForm.controls.sku.enable();
        break;
      case false:
        this.checkoutForm.controls.sku.disable();
        break;
      default:
        this.checkoutForm.controls.sku.disable();
        break;
    }
  }

  onBorrow() {
    let updateItem: Item[];
    if (this.checkoutForm.controls.sku.valid) {
      updateItem = this.appDataService.items.filter(item => item.sku === this.checkoutForm.controls.sku.value);
      if (updateItem.length !== 0) { // SKU Exists
        if (updateItem[0].stock === 'In') {
          this.itemService.borrowItem(updateItem[0], this.checkoutForm.controls.name.value);
        } else { this.snackBarRef.open('This Item Is Currently Borrowed', 'Dismiss', {panelClass: ['notification-snackbar']}); }
      } else { this.snackBarRef.open('SKU Does Not Exist', 'Dismiss', {panelClass: ['notification-snackbar']}); }
      this.checkoutForm.controls.sku.reset();
    }
  }

  onClose() { this.checkoutForm.reset(); this.dialogRef.close(); }
}
