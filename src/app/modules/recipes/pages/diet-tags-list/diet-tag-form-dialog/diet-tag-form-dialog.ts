import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DietTag } from '../../../contracts/DietTag';
import { DietTagApiPayload } from '../../../contracts/DietTagApiPayload';
import { DietTagsStore } from '../../../store/diet-tags.store';

export interface DietTagFormDialogData {
  dietTag?: DietTag;
}

@Component({
  selector: 'app-diet-tag-form-dialog',
  standalone: false,
  templateUrl: './diet-tag-form-dialog.html',
  styleUrl: './diet-tag-form-dialog.scss',
})
export class DietTagFormDialog implements OnInit {
  name = '';
  description = '';
  saving = false;

  get isEdit(): boolean {
    return !!this.data.dietTag;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DietTagFormDialogData,
    private dialogRef: MatDialogRef<DietTagFormDialog>,
    private store: DietTagsStore,
  ) {}

  ngOnInit(): void {
    if (this.data.dietTag) {
      this.name = this.data.dietTag.name;
      this.description = this.data.dietTag.description ?? '';
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.saving) return;
    this.saving = true;

    const payload: DietTagApiPayload = {
      name: this.name,
      description: this.description || null,
    };

    const op$ = this.isEdit
      ? this.store.update(this.data.dietTag!.id, payload)
      : this.store.create(payload);

    op$.subscribe({
      next: tag => this.dialogRef.close(tag),
      error: () => { this.saving = false; },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
