import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Rutas (pantallas) de la aplicación.
const routes: Routes = [
  {
    // Pantalla de inicio: muestra si hay un usuario registrado.
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    // Registro: nombre + foto de perfil.
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule),
  },
  {
    // Login biométrico: prueba de vida + comparación de rostros.
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    // Pantalla que se muestra cuando el rostro fue reconocido.
    path: 'bienvenida',
    loadChildren: () => import('./pages/bienvenida/bienvenida.module').then(m => m.BienvenidaPageModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
