## architecture globale de l'application 

Partons sur les features des dernières versions angular (orientées standalone et signals)

*   point 1: standalone paradigme (élimination des modules)
*   point 2: les syntaxes de control flow
*   point 3: state management, choix de la lib ngrx signals store (VS natif rxjs ou NgRx+redux)

Côté architecture : 
*   point 4: smart/presentational components (data-flow control)
*   point 5: clean architecture - pattern port/adapter

cette architecture port/adapter permet de découpler le "langage" métier de son implémentation de code
Objectif : viser l'adaptabilité au changement dans le futur. L'architecture port/adapter permet : 

*   la possibilité d'interchanger des services, 
*   la possibilité d'interchanger un système de state management
*   la adaptabilité des tests

Plus globalement, j'axe le choix de l'architecture, selon : 

1 La DX (Developer Xperience) - respecter la séparation des responsabilités tout en limitant le nombre de couches/fichiers/dossiers, pour conserver le côté "libération mentale du dev".

2 architecture doit être évolutive - prévoir une architecture selon les changements connus ou anticipés, mais pas plus 

3 architecture qui reflète mon besoins métier 

Le choix final est un compromis entre évolutivité, et vélocité de dev et deboguage

## 2/ components ui

*  creation des component UI réutilisables (product-card, button, tag, form-field)
ils sont des presentationals components donc ne gèrent aucun état, mais uniquement de la data en Input et Output

  
## 3/ CSS global

  layout responsive (container, row, col)

*   soit en CSS grid,
*   soit en CSS flexbox



---------------

design-system
    layout.scss
    ui
        ui-button.component.ts
        ui-tag.component.ts
        ui-form-field.ts

products
    products-list-view.component.ts
    data
        product.service.ts
        product.store.ts
    ui
        product-card.component.ts
    



