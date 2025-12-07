import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { Observable } from 'rxjs';
import { Ingredient } from '../contracts/Ingredient';
import { IngredientApiResource } from '../contracts/IngredientApiResource';
import { Paginator } from '../../../core/Paginator/paginator';
import { IngredientsMapper } from '../mappers/IngredientsMapper';
import { PaginatorMapper } from '../../../core/Paginator/PaginatorMapper';
import { PaginatorApiResource } from '../../../core/Paginator/PaginatorApiResource';
import { Breadcrumb } from '../../../core/Breadcrumb/breadcrumb.d';

type IngredientIndexApiResource = {
    data: IngredientApiResource[]
} & PaginatorApiResource

@Injectable({ providedIn: 'root' })
export class IngredientsStore {
    constructor(
        private http: HttpClient,
        private fetcher: ApiFetcherService
    ) {}

    private _ingredients = signal<Ingredient[]>([]);
    private _paginator = signal<Paginator | null>(null);
    private _breadcrumb = signal<Breadcrumb[]>([]);

    // expose readony signals
    readonly ingredients = this._ingredients.asReadonly();
    readonly paginator = this._paginator.asReadonly();
    readonly breadcrumb = this._breadcrumb.asReadonly();

    // setters
    setIngredients(index: Ingredient[]): void {
        this._ingredients.set(index);
    }

    setPaginator(paginator: Paginator | null = null): void {
        this._paginator.set(paginator);
    }

    setBreadcrumb(links: Breadcrumb[]): void {
        this._breadcrumb.set(links);
    }

    index(page: number | null = null, url: string = 'http://localhost:9015/api/ingredients'): Observable<void> {
        const finalUrl = page ? `${url}?page=${page}` : url;

        return this.fetcher.fetchAndProcess<IngredientIndexApiResource>(
            finalUrl,
            'Ingredients index loaded.',
            body => {
                if (!body) {
                    this.setIngredients([]);
                    this.setPaginator(null);
                    return;
                }
                const { data, ...paginator } = body;
                const ingredients: Ingredient[] = data.map(d => new IngredientsMapper().toApp(d));
                this.setIngredients(ingredients);

                this.setPaginator(new PaginatorMapper().toApp(paginator as PaginatorApiResource));

                this.setBreadcrumb([
                    { icon: 'home', link: '/' },
                    { title: 'Ingredients' }
                ]);
            }
        );
    }
}
