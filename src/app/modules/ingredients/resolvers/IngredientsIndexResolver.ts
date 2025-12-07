import { ResolveFn } from "@angular/router";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { IngredientsStore } from "../store/ingredients.store";

export const IngredientsIndexResolver: ResolveFn<Observable<any>> | ResolveFn<void> = () => {
    const store = inject(IngredientsStore);
    return store.index();
}