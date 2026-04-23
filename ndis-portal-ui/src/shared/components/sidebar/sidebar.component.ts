import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import your Tabler-style SVG components
import { HomeIconComponent } from '../icons/svg-icons/home-icon';
import { BellIconComponent } from '../icons/svg-icons/bell-icon'; 
import { ChatIconComponent } from '../icons/svg-icons/chat-icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeIconComponent, ChatIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // Functional navigation config
  navItems = [
    { label: 'Services', path: '/services', icon: 'services' },
    { label: 'My Bookings', path: '/bookings', icon: 'bookings' },
  ];
}
