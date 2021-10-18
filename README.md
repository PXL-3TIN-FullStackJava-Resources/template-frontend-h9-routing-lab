# H9 Routing
In deze lab maken we gebruik van angular routing om gebruik te maken van verschillende views op basis van de route in de URL. De applicatie zelf bestaat uit enkele losse components, een service die http calls kan maken naar de Devops API van vorig schooljaar en een authservice die instaat voor het bijhouden van de API key.

Gegeven is deze repo. Hierin staat een Angular project met reeds een confessions applicatie uit de vorige labs. **Navigeer naar deze folder via de CLI** en voer volgend commando uit: ```npm install```
 
Vervolgens voer je, nog steeds in deze folder, het commando ```ng serve -o``` uit. Hiermee zal de applicatie gestart worden en gaat er automatisch een browser open. Moest dit laatste niet het geval zijn, surf je naar http://localhost:4200. Bij elke aanpassing in de code zal de browser automatisch refreshen.

![alt_text](https://i.imgur.com/TT9FcyW.png "image_tooltip") Bekijk voor het starten van de lab de applicatie code. Leg hierbij de focus op de werking en het gebruik van de `student.service.ts` en de `auth.service.ts`.

# Routing module
![alt_text](https://i.imgur.com/TT9FcyW.png "image_tooltip") Bekijk de `app-routing.module.ts` file en hoe deze gelinked is aan de `app.module.ts` file. De routing module wordt aangemaakt door Angular bij het aanmaken van een nieuw project via `ng new`.

In de file `app-routing.module.ts` voorzien we routes die gebruikt worden in de applicatie. Pas de routes constante aan als volgt:
```typescript
const routes: Routes = [
  {path: 'home', component: GroupListComponent},
  {path: 'add', component: AddStudentComponent},
  {path: 'settings', component: SettingsComponent},
];
```
Daarnaast voorzien we ook nog een route die een redirect voorziet als er geen specfieke route opgegeven wordt:
```typescript
  {path: '', redirectTo: 'home', pathMatch: 'full'}
```

Tenslotte, helemaal onderaan de `routes` array, voorzie je nog een wildcard route die alle niet bestaande routes gaat redirecten naar de `home` route:
```typescript
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
```
Het is belangrijk dat deze route onderaan staat. Anders wordt deze route getriggered voor alle geactiveerde routes.

# Router outlet & linken

Vervolgens voorzien we een plaats in de `app.component.html` waardat de components getoond worden als er routes geactiveerd worden:
```html
<app-navbar></app-navbar>
<div class="content">
  <router-outlet></router-outlet>
</div>
```
Je kan nu in principe de routes al testen door de url in de browser rechtstreeks in te geven. Hierna voorzien we linken om deze routes te activeren. We gebruiken geen default html routing  maar maken gebruik van `routerlink` attributen. Deze spreken dan de router van Angular zelf aan in plaats van de browser functionaliteit te gebruiken. Pas de `navbar.component.html` aan als volgt:
```html
<ul>
    <li><a [routerLink]="['/home']" routerLinkActive="active">Home</a></li>
    <li><a [routerLink]="['/add']" routerLinkActive="active">Add student</a></li>
    <li><a [routerLink]="['/settings']" routerLinkActive="active">Settings</a></li>
</ul>
```
Het attribuut `routerLinkActive` zorgt ervoor dat de actieve link de css klasse `active` meekrijgt. Je kan vervolgens de applicatie al testen. Components worden getoond maar HTML requests lukken nog niet. Dit komt omdat de API key nog niet geset is. Ga naar de `settings` Pagina en geef de key `2TINDEVOPS`in.

# Routeguards
We willen in de applicatie ervoor zorgen dat gebruikers pas naar de verschillende components kunnen gaan na het ingeven van een API key (het checken of deze key dan ook correct is, doen we nog niet, maar zou hier ook perfect in kunnen). Hiervoor maken we gebruik van routeguards die we kunnen koppelen aan verschillende routes. Gebruik de angular CLI om een routeguard te maken via volgend commando die gebruik maakt van de `CanActivate` interface:
```
ng generate guard shared/services/auth --implements CanActivate
```
Vervolgens is er in de folder `shared/services` een nieuwe file `auth.guard.ts` aangemaakt. In de constructor van deze klasse voorzien we de injectie van de `router` en de `AuthService`:
```typescript
constructor(private auth: AuthService, private router: Router){}
```

Deze dependencies kunnen we dan gebruiken in de code van deze routeguard. Voorzie de `canActivate` methode van volgende code:
```typescript
canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.auth.getKey != ''){
      return true;
    }
    this.router.navigate(['settings']);
    return false;
  }
}
```

De routeguard checkt of er een key ingevuld is, indien niet wordt er doorverwezen naar de settings component. Vervolgens linken we deze routeguard aan de routes in `app-routing.module.ts`:
```typescript
const routes: Routes = [
  {path: 'home', component: GroupListComponent, canActivate: [AuthGuard]},
  {path: 'add', component: AddStudentComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
```
Daarnaast willen we ook een check doen in de `AddStudentComponent`. Indien de gebruiker de pagina wil verlaten zonder de gegevens op te slaan, willen we een check doen of hij hier wel zeker van is. Gebruik de angular CLI om nog een routeguard te maken via volgend commando die gebruik maakt van de `CanDeactivate` interface:
```
ng generate guard shared/services/save --implements CanDeactivate
```

Vervolgens is er in de folder `shared/services` een nieuwe file `save.guard.ts` aangemaakt. De `canDeactivate` methode in deze file krijgt een component binnen, deze passen we aan naar de `AddStudentComponent`. Op die manier kan je alle properties en methodes van deze component aanspreken. Daarnaast voorzie je in de methode deze code:
```typescript
export class SaveGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: AddStudentComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(component.addForm.dirty && !component.isSubmitted){
      return window.confirm("Unsaved changes, are you sure you want to leave?");
    }
    return true;
  }
  
}
```
Vervolgens linken we deze routeguard aan de routes in `app-routing.module.ts`:
```typescript
 {path: 'add', component: AddStudentComponent, canActivate: [AuthGuard], canDeactivate: [SaveGuard]},
 ```

 Je kan één of meerdere routeguard koppelen aan één of meerdere routes.

# Parameters in routes
Bij het klikken op de detail knop in het overzicht willen we naar de detailpagina van die groep gaan. Hiervoor gaan we werken met parameters in de route. We starten met het toevoegen van onderstaande route in de file `app-routing.module.ts`:
```typescript
  {path: 'group/:group', component: GroupDetailComponent, canActivate: [AuthGuard]},
```
Vervolgens moeten we in de `GroupDetailComponent` ervoor zorgen dat de meegegeven parameter opgevangen wordt. Hiervoor injecteren we in de component de `ActivatedRoute`:
```typescript
constructor(private activatedRoute: ActivatedRoute, private studentService: StudentService) { }
```

Hierna kunnen we deze dependency gebruiken in de `NgOnInit` methode om de parameter uit de route te halen. We gebruiken deze parameter vervolgens om data op te halen uit de API via de `StudentService`:
```typescript
ngOnInit(): void {
    this.group = this.activatedRoute.snapshot.params['group'];
    this.students$ = this.studentService.getStudentsByGroup(this.group);
  }
```

Tenslotte voorzien we in de `group-list.component.ts` file nog volgende aanpassingen aan de `clickDetails` methode die navigeert naar de route en de parameter meegeeft:
```typescript
 clickDetails(group: String){
    this.router.navigate(['group',group]);
  }
```






