import { ResolveFn } from "@angular/router";
import { Observable } from "rxjs";
import { NutrientsStore } from "../store/nutrients.store";
import { inject } from "@angular/core";

export const NutrientsIndexResolver: ResolveFn<Observable<any>> = () => {
    const store = inject(NutrientsStore);
    return store.index();
}