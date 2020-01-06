import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Item } from '../../../../../models/item.model';
import {AppDataService} from '../../../../../services/app-data.service';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.css']
})
export class HistoryDialogComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:max-line-length
  constructor(private dialogRef: MatDialogRef<HistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public item: Item, public appDataService: AppDataService) {}

  ngOnInit() { this.appDataService.day = Number(Date.now()); }

  ngOnDestroy() {}
}
