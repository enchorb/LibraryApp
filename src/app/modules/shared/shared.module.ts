import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'hammerjs';

// Material
import {
  MatButtonModule,
  MatDialogModule,
  MatSnackBarModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatRippleModule,
  MatTooltipModule,
  MatInputModule,
  MatRadioModule,
  MatFormFieldModule
} from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Components
import { HistoryDialogComponent } from './components/dialogs/history/history-dialog.component';
import { AddDialogComponent } from './components/dialogs/add/add-dialog.component';
import { CheckoutDialogComponent } from './components/dialogs/checkout/checkout-dialog.component';

// Services
import { AppDataService } from '../../services/app-data.service';
import { ItemService } from '../../services/item.service';
import { UIService } from '../../services/ui.service';
import { SearchNamePipe } from '../../pipes/search-name.pipe';
import { SearchTypePipe } from '../../pipes/search-type.pipe';
import { SearchStockPipe } from '../../pipes/search-stock.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    ScrollingModule
  ],
  declarations: [
    HistoryDialogComponent,
    AddDialogComponent,
    CheckoutDialogComponent,
    SearchNamePipe,
    SearchTypePipe,
    SearchStockPipe
  ],
  entryComponents: [
    HistoryDialogComponent,
    AddDialogComponent,
    CheckoutDialogComponent
  ],
  exports: [
    SearchNamePipe,
    SearchTypePipe,
    SearchStockPipe,
    FormsModule,
    ReactiveFormsModule,
    HistoryDialogComponent,
    AddDialogComponent,
    CheckoutDialogComponent,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    ScrollingModule
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AppDataService, ItemService, UIService,
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
        ]
    };
  }
}
