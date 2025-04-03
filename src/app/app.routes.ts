import { Routes } from '@angular/router';
import { HomepageComponent } from './components/pages/homepage/homepage.component';
import { ProductPageComponent } from './components/pages/product-page/product-page.component';
import { AboutPageComponent } from './components/pages/about/about.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './services/auth/auth-guard.service';


export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'products', component: ProductPageComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },

    { path: '**', component: NotFoundComponent }
];
