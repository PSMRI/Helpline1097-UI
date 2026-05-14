import { Component, Input } from '@angular/core';

@Component({
  selector: 'z-card',
  template: `
    <div [className]="cardClass">
      <div *ngIf="title" class="px-6 py-4 border-b border-border">
        <h3 class="text-lg font-semibold leading-none tracking-tight">{{title}}</h3>
        <p *ngIf="description" class="text-sm text-muted-foreground mt-1.5">{{description}}</p>
      </div>
      <div class="p-6 pt-0 mt-4">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footer" class="px-6 py-4 border-t border-border flex items-center">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() footer: boolean = false;
  @Input() className: string = '';

  get cardClass(): string {
    return `rounded-lg border border-border bg-card text-card-foreground shadow-sm ${this.className}`;
  }
}
