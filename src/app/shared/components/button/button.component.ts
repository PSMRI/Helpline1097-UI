import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'z-button',
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [className]="buttonClass"
      (click)="onClick($event)"
    >
      <span *ngIf="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: string = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() className: string = '';

  @Output() click = new EventEmitter<MouseEvent>();

  get buttonClass(): string {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10'
    };

    return `${baseStyles} ${variants[this.variant]} ${sizes[this.size]} ${this.className}`;
  }

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
}
