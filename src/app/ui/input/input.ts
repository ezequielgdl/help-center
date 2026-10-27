import { Component, input, model } from '@angular/core';

export type InputType = 'text' | 'email' | 'password';

let nextId = 0;

@Component({
  imports: [],
  selector: 'app-input',
  styleUrl: './input.css',
  templateUrl: './input.html',
})
export class Input {
  private readonly uid = `app-input-${nextId++}`;
  readonly inputId = this.uid;
  readonly errorId = `${this.uid}-error`;

  readonly label = input.required<string>();
  readonly type = input<InputType>('text');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly error = input<string | null>(null);
  readonly value = model('');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
