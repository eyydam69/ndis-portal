import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-filter',
  standalone: true,
  template: `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.46154 12H17.5385M4 7H20M10.1538 17H13.8462"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
    `,
  ],
})
export class FilterIconComponent {
  @Input() size: number = 16;
}
