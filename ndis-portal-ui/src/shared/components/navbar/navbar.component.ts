import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BellIconComponent } from '../icons/svg-icons/bell-icon';
import { ChatIconComponent } from '../icons/svg-icons/chat-icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    BreadcrumbComponent,
    BellIconComponent,
    ChatIconComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  
}
