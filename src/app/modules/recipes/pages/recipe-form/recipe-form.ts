import { Component, OnInit, computed, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesStore } from '../../store/recipes.store';
import { DietTagsStore } from '../../store/diet-tags.store';
import { RecipeApiPayload } from '../../contracts/RecipeApiPayload';
import { RecipeIngredient } from '../../contracts/Recipe';
import { NutrientProfileRow } from '../../contracts/NutrientProfile';
import { IngredientsStore } from '../../../ingredients/store/ingredients.store';
import { UnitsStore } from '../../../ingredients/store/units.store';

@Component({
  selector: 'app-recipe-form',
  standalone: false,
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeFormPage implements OnInit {
  recipeId: number | null = null;
  saving = false;

  // diet tags
  tagging = false;
  selectedTagId: number | null = null;

  // ingredient inline edit
  editingIngredientId: number | null = null;
  editAmount = 0;
  editUnitId = 0;
  savingPivot = false;

  // add ingredient
  addIngredientSearch = '';
  addIngredientId: number | null = null;
  addAmount = 1;
  addUnitId: number | null = null;
  adding = false;

  readonly ingColumns = ['name', 'pivot', 'actions'];

  // nutrient profile
  readonly nutrientProfileView = signal<'total' | 'per_portion'>('total');
  readonly profileRows = computed<NutrientProfileRow[]>(() => {
    const profile = this.store.nutrientProfile();
    if (!profile) return [];
    return this.nutrientProfileView() === 'total' ? profile.total : profile.perPortion;
  });

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
    public ingredientsStore: IngredientsStore,
    public unitsStore: UnitsStore,
  ) {}

  ngOnInit(): void {
    this.dietTagsStore.index().subscribe();
    this.unitsStore.index().subscribe();

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
        this.store.loadNutrientProfile(this.recipeId!).subscribe();
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

  refreshProfile(): void {
    if (!this.recipeId) return;
    this.store.loadNutrientProfile(this.recipeId).subscribe();
  }

  searchIngredients(): void {
    if (!this.addIngredientSearch.trim()) return;
    this.ingredientsStore.search(this.addIngredientSearch);
  }

  startEdit(ing: RecipeIngredient): void {
    this.editingIngredientId = ing.id;
    this.editAmount = ing.amount;
    this.editUnitId = ing.unitId;
  }

  cancelEdit(): void {
    this.editingIngredientId = null;
  }

  savePivot(ingredientId: number): void {
    if (!this.recipeId || this.savingPivot) return;
    this.savingPivot = true;
    this.store.updateIngredientPivot(this.recipeId, ingredientId, this.editAmount, this.editUnitId).subscribe({
      next: () => { this.editingIngredientId = null; this.savingPivot = false; },
      error: () => { this.savingPivot = false; },
    });
  }

  detachIngredient(ingredientId: number): void {
    if (!this.recipeId) return;
    this.store.detachIngredient(this.recipeId, ingredientId).subscribe();
  }

  attachIngredient(): void {
    if (!this.recipeId || !this.addIngredientId || !this.addUnitId || this.adding) return;
    this.adding = true;
    this.store.attachIngredient(this.recipeId, this.addIngredientId, this.addAmount, this.addUnitId).subscribe({
      next: () => {
        this.addIngredientId = null;
        this.addAmount = 1;
        this.addUnitId = null;
        this.adding = false;
      },
      error: () => { this.adding = false; },
    });
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
