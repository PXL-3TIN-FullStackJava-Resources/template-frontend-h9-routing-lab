# H9 Routing
In deze lab maken we gebruik van angular routing om gebruik te maken van verschillende views op basis van de route in de URL. De applicatie zelf bestaat uit enkele losse components, een service die http calls kan maken naar de Devops API van vorig schooljaar en een authservice die instaat voor het bijhouden van de API key.

Gegeven is deze repo. Hierin staat een Angular project met reeds een confessions applicatie uit de vorige labs. **Navigeer naar deze folder via de CLI** en voer volgend commando uit: ```npm install```
 
Vervolgens voer je, nog steeds in deze folder, het commando ```ng serve -o``` uit. Hiermee zal de applicatie gestart worden en gaat er automatisch een browser open. Moest dit laatste niet het geval zijn, surf je naar http://localhost:4200. Bij elke aanpassing in de code zal de browser automatisch refreshen.

![alt_text](https://i.imgur.com/TT9FcyW.png "image_tooltip") Bekijk voor het starten van de lab de applicatie code. Leg hierbij de focus op de werking en het gebruik van de `student.service.ts` en de `auth.service.ts`.

# Routing module
![alt_text](https://i.imgur.com/TT9FcyW.png "image_tooltip") Bekijk de `app-routing.module.ts` file en hoe deze gelinked is aan de `app.module.ts` file. De routing module wordt aangemaakt door Angular bij het aanmaken van een nieuw project via `ng new`.

In deze file voorzien we routes die gebruikt worden in de applicatie. Pas de routes constante aan als volgt:
```typescript
const routes: Routes = [
  {path: 'home', component: GroupListComponent},
  {path: 'add', component: AddStudentComponent},
  {path: 'settings', component: SettingsComponent},
];
```

```typescript
  {path: '', redirectTo: 'home', pathMatch: 'full'}
```

```typescript
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
```
# Router outlet & linken

Vervolgens voorzien we een plaats in de `app.component.html` waardat de components getoond worden als er routes geactiveerd worden:
```html
<app-navbar></app-navbar>
<div class="content">
  <router-outlet></router-outlet>
</div>
```
Hierna voorzien we linken om deze routes te activeren. We gebruiken geen default html validatie maar maken gebruik van `routerlink` attributen. Pas de `navbar.component.html` aan als volgt:
```html
<ul>
    <li><a [routerLink]="['/home']" routerLinkActive="active">Home</a></li>
    <li><a [routerLink]="['/add']" routerLinkActive="active">Add student</a></li>
    <li><a [routerLink]="['/settings']" routerLinkActive="active">Settings</a></li>
</ul>
```

Je kan vervolgens de applicatie al testen. Components worden getoond maar HTML requests lukken nog niet. Dit komt omdat de API key nog niet geset is. Ga naar de `settings` Pagina en geef de key `2TINDEVOPS`in.

# Routeguards
Gebruik de angular CLI om een routeguard te maken via volgend commando
```
ng generate shared/services/guard auth --implements canActivate
```

```typescript
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.auth.getKey != ''){
      return true;
    }
    console.log("test");
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
Gebruik de angular CLI om nog een routeguard te maken via volgend commando
```
ng generate shared/services/save auth --implements canDeactivate
```

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

```typescript
 {path: 'add', component: AddStudentComponent, canActivate: [AuthGuard], canDeactivate: [SaveGuard]},
 ```

# Parameters in routes

```typescript
 clickDetails(group: String){
    this.router.navigate(['group',group]);
  }
```

```typescript
  {path: 'group/:group', component: GroupDetailComponent, canActivate: [AuthGuard]},
```

```typescript
constructor(private activatedRoute: ActivatedRoute, private studentService: StudentService) { }
```

```typescript
ngOnInit(): void {
    this.group = this.activatedRoute.snapshot.params['group'];
    this.students$ = this.studentService.getStudentsByGroup(this.group);
  }
```
