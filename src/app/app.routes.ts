import { Routes } from '@angular/router';
import { HomepageComponent } from './components/pages/homepage/homepage.component';
import { ProductPageComponent } from './components/pages/product-page/product-page.component';
import { AboutPageComponent } from './components/pages/about/about.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SignupComponent } from './components/pages/signup/signup.component';
import { MenuComponent } from './components/pages/menu/menu.component';
import { RoleComponent } from './components/pages/role/role.component';
import { AddMenuComponent } from './components/pages/menu/add-menu/add-menu.component';


export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'products', component: ProductPageComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutPageComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    /* login and signup routes */
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },

    /* admin master routes */
    { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
    { path: 'menu/add', component: AddMenuComponent, canActivate: [AuthGuard] },
    { path: 'menu/add/:id', component: AddMenuComponent, canActivate: [AuthGuard] },

    { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },


    /* Redirect to login if not authenticated */
    { path: '**', component: NotFoundComponent }
];
