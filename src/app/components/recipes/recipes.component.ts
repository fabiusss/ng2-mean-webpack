// ```
// recipes.component.js
// (c) 2016 David Newman
// blackshuriken@hotmail.com
// recipes.component.js may be freely distributed under the MIT license
// ```

// # Recipes Component

import {Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppStore} from '../../app.store';

import {Recipe} from './recipes.reducer.ts';
import {RecipeService} from './recipe.service';
import {RecipeDetails} from './recipe-details.component';
import {RecipeList} from './recipe-list.component';

@Component({
  selector: 'recipes',
  providers: [],
  template: `
    <div>
      <recipe-list [recipes]="recipes | async"
        (selected)="selectRecipe($event)" (deleted)="deleteRecipe($event)">
      </recipe-list>
    </div>
    <div>
      <recipe-detail
        (saved)="saveRecipe($event)" (cancelled)="resetRecipe($event)"
        [recipe]="selectedRecipe | async">Pick your Fancy:</recipe-detail>

    </div>
  `,
  directives: [RecipeList, RecipeDetails],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Recipes {

  recipes: Observable<Array<Recipe>>;

  selectedRecipe: Observable<Recipe>;

  constructor(private recipeService: RecipeService,
              private store: Store<AppStore>) {

    // Bind to the `recipes` observable on `RecipeService`
    this.recipes = recipeService.recipes;

    // Bind the `selectedRecipe` observable from the store
    this.selectedRecipe = store.select('selectedRecipe');

    this.selectedRecipe.subscribe(v => console.log(v));

    // `recipeService.loadRecipes` dispatches the `ADD_RECIPES` event
    // to our store which in turn updates the `recipes` collection
    recipeService.loadRecipes();
  }

  selectRecipe(recipe: Recipe) {

    this.store.dispatch({

      type: 'SELECT_RECIPE',
      payload: recipe
    })
  }

  deleteRecipe(recipe: Recipe) {

    this.recipeService.deleteRecipe(recipe);
  }

  resetRecipe() {

    let emptyRecipe: Recipe = {

      _id: null,
      tags: [],
      title: '',
      description: '',
      rating: null,
      creator: '',
      ingredients: [],
      directions: []
    };

    this.store.dispatch({

      type: 'SELECT_RECIPE',
      payload: emptyRecipe
    });
  }

  saveRecipe(recipe: Recipe) {

    this.recipeService.saveRecipe(recipe);
    this.resetRecipe();
  }
}
