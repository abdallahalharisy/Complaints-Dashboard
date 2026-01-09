import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Complaints-project';
  showSidebar: boolean = false;

  constructor(private router: Router) {
    // Check initial route
    this.updateSidebarVisibility(this.router.url);
    
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateSidebarVisibility(event.url);
      });
  }

  private updateSidebarVisibility(url: string): void {
    // Show sidebar only on specific routes
    const routesWithSidebar = ['/analytics', '/complaints', '/agencies', '/users'];
    this.showSidebar = routesWithSidebar.some(route => url === route || url.startsWith(route + '/'));
  }
}
