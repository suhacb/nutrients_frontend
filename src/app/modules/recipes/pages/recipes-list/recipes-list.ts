import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Recipe } from '../../contracts/Recipe';
import { RecipesStore } from '../../store/recipes.store';
import { ConfirmCancelDialog } from '../../../../core/ConfirmCancelDialog/confirm-cancel-dialog';

@Component({
  selector: 'app-recipes-list',
  standalone: false,
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.scss',
})
export class RecipesListPage implements OnInit {
  readonly displayedColumns = ['name', 'portions', 'syncStatus', 'actions'];

  constructor(
    public store: RecipesStore,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.index();
  }

  openEdit(recipe: Recipe): void {
    this.router.navigate(['/admin/recipes', recipe.id, 'edit']);
  }

  confirmDelete(recipe: Recipe): void {
    const ref = this.dialog.open(ConfirmCancelDialog, {
      data: {
        title: 'Delete recipe',
        content: `Delete "${recipe.name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
      },
    });

    ref.componentInstance.confirm.subscribe(() => {
      this.store.delete(recipe.id).subscribe(() => ref.close());
    });

    ref.componentInstance.cancel.subscribe(() => ref.close());
  }
}
