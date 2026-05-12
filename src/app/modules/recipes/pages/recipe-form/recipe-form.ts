import { Component, OnInit, computed } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesStore } from '../../store/recipes.store';
import { DietTagsStore } from '../../store/diet-tags.store';
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
  tagging = false;
  selectedTagId: number | null = null;

  name = '';
  description = '';
  instructions = '';
  portions = 1;
  sourceUrl = '';

  get isEdit(): boolean {
    return this.recipeId !== null;
  }

  readonly availableTags = computed(() => {
    const all = this.dietTagsStore.dietTags();
    const attachedIds = new Set((this.store.recipe()?.dietTags ?? []).map(t => t.id));
    return all.filter(t => !attachedIds.has(t.id));
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public store: RecipesStore,
    public dietTagsStore: DietTagsStore,
  ) {}

  ngOnInit(): void {
    this.dietTagsStore.index().subscribe();

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

  attachTag(): void {
    if (!this.selectedTagId || !this.recipeId || this.tagging) return;
    this.tagging = true;
    this.store.attachDietTag(this.recipeId, this.selectedTagId).subscribe({
      next: () => { this.selectedTagId = null; this.tagging = false; },
      error: () => { this.tagging = false; },
    });
  }

  detachTag(tagId: number): void {
    if (!this.recipeId) return;
    this.store.detachDietTag(this.recipeId, tagId).subscribe();
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
