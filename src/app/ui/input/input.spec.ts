import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Email');
    await fixture.whenStable();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links the label to the input via for/id', () => {
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe(nativeInput().id);
  });

  it('updates the value model on input', () => {
    fixture.detectChanges();
    const el = nativeInput();
    el.value = 'hi@example.com';
    el.dispatchEvent(new Event('input'));
    expect(component.value()).toBe('hi@example.com');
  });

  it('marks the input invalid and describes it by the error message when error is set', () => {
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    const el = nativeInput();
    expect(el.getAttribute('aria-invalid')).toBe('true');
    const describedBy = el.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(fixture.nativeElement.querySelector(`#${describedBy}`).textContent).toContain('Required');
  });

  it('disables the native input when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(true);
  });
});
