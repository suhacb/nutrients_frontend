import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { IngredientsStore } from "../store/ingredients.store";

export const IngredientsShowResolver: ResolveFn<Observable<any>> | ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const store = inject(IngredientsStore);
    const id = route.paramMap.get('id');

    if (!id) {
        throw new Error('Nutrient ID is missing in route parameters');
    }
    
    return store.show(+id);
}