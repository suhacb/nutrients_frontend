import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesStore } from '../../store/recipes.store';
import { RecipeApiPayload } from '../../contracts/RecipeApiPayload';

@Component({
  selector: 'app-recipe-form',
  standalone: false,
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeFormPage implements OnInit {
  recipeId: number | null = null;
  saving = false;

  name = '';
  description = '';
  instructions = '';
  portions = 1;
  sourceUrl = '';

  get isEdit(): boolean {
    return this.recipeId !== null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public store: RecipesStore,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeId = +id;
      this.store.show(this.recipeId).subscribe(() => {
        const recipe = this.store.recipe();
        if (!recipe) return;
        this.name = recipe.name;
        this.description = recipe.description ?? '';
        this.instructions = recipe.instructions ?? '';
        this.portions = recipe.portions;
        this.sourceUrl = recipe.sourceUrl ?? '';
      });
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || this.saving) return;
    this.saving = true;

    const payload: RecipeApiPayload = {
      name: this.name,
      description: this.description || null,
      instructions: this.instructions || null,
      portions: this.portions,
      source_url: this.sourceUrl || null,
    };

    const op$ = this.isEdit
      ? this.store.update(this.recipeId!, payload)
      : this.store.create(payload);

    op$.subscribe({
      next: recipe => this.router.navigate(['/admin/recipes', recipe.id, 'edit']),
      error: () => { this.saving = false; },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/recipes']);
  }
}
