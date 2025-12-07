import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { NutrientsStore } from "../store/nutrients.store";
import { inject } from "@angular/core";

export const NutrientsShowResolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const store = inject(NutrientsStore);
    const id = route.paramMap.get('id');

    if (!id) {
        throw new Error('Nutrient ID is missing in route parameters');
    }
    
    return store.show(+id);
}