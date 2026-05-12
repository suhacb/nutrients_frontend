import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DietTag } from '../../contracts/DietTag';
import { DietTagsStore } from '../../store/diet-tags.store';
import { ConfirmCancelDialog } from '../../../../core/ConfirmCancelDialog/confirm-cancel-dialog';
import { DietTagFormDialog, DietTagFormDialogData } from './diet-tag-form-dialog/diet-tag-form-dialog';

@Component({
  selector: 'app-diet-tags-list',
  standalone: false,
  templateUrl: './diet-tags-list.html',
  styleUrl: './diet-tags-list.scss',
})
export class DietTagsListPage implements OnInit {
  readonly displayedColumns = ['name', 'description', 'actions'];

  constructor(
    public store: DietTagsStore,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.index().subscribe();
  }

  openCreate(): void {
    this.dialog.open<DietTagFormDialog, DietTagFormDialogData>(DietTagFormDialog, {
      width: '480px',
      data: {},
    });
  }

  openEdit(dietTag: DietTag): void {
    this.dialog.open<DietTagFormDialog, DietTagFormDialogData>(DietTagFormDialog, {
      width: '480px',
      data: { dietTag },
    });
  }

  confirmDelete(dietTag: DietTag): void {
    const ref = this.dialog.open(ConfirmCancelDialog, {
      data: {
        title: 'Delete diet tag',
        content: `Delete "${dietTag.name}"? This cannot be undone.`,
      },
    });

    ref.componentInstance.confirm.subscribe(() => {
      this.store.delete(dietTag.id).subscribe(() => ref.close());
    });

    ref.componentInstance.cancel.subscribe(() => ref.close());
  }
}
