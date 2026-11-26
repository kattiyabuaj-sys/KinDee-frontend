/**
 * @typedef {'protein'|'carb'|'veggie'|'seasoning'|'fat'} IngredientCategory
 * @typedef {'seafood'|'nuts'|'dairy'|'gluten'|'soy'} Allergen
 * @typedef {{calories:number,proteinG:number,carbsG:number,fatG:number,sodiumMg:number,sugarG:number}} Nutrition100
 * @typedef {{unit:string,grams:number}} StandardUnit
 * @typedef {{id:string,nameTh:string,category:IngredientCategory,nutritionPer100g:Nutrition100,standardUnits:StandardUnit[],defaultUnit:string,estimatedCostThbPer100g:number,allergenFlags:Allergen[],isAnimal:boolean}} MasterIngredient
 * @typedef {{id:string,sourceIngredientId:string,targetIngredientId:string,ratioBasis:'protein'|'calories'|'balanced'|number,conversionRatio:number,compatibleDishStyles:string[],dietaryBenefits:string[],reasonTh:string}} SubstitutionRule
 * @typedef {{ingredientId:string,grams:number,scalable?:boolean}} MealLine
 * @typedef {{cal:number,p:number,c:number,f:number,na:number,s:number,cost:number}} NutritionTotals
 * @typedef {{id:string,nameTh:string,dishStyle:string,mealTiming:('breakfast'|'lunch'|'dinner')[],equipment:('stove'|'microwave'|'air_fryer'|'no_cook')[],prepTimeMins:number,spiceLevel:0|1|2|3,glycemicLoad:'low'|'medium',healthGoals:string[],mealPrepFriendly:boolean,ingredients:MealLine[],stepsTh:string[],allergens:Allergen[],excludedAllergens:Allergen[],isVegetarian:boolean,nutrition?:NutritionTotals,costThb?:number}} Meal
 * @typedef {{sex:'m'|'f',age:number,kg:number,cm:number,act:0|1|2|3}} UserBiometrics
 * @typedef {{goals:string[],kit:string[],ex:string[]}} FilterPreferences
 * @typedef {{mealId:string,at:string}} SpinEntry
 * @typedef {{id:string,mealId:string,nameTh:string,loggedAt:string,nutrition:NutritionTotals,swaps?:Object<string,string>}} DailyLogEntry
 * @typedef {{biometrics:UserBiometrics,preferences:FilterPreferences,savedMealIds:string[],spinHistory:SpinEntry[],userSwapPreferences:Object<string,Object<string,number>>,todayLog:DailyLogEntry[]}} UserState
 */
export {}
