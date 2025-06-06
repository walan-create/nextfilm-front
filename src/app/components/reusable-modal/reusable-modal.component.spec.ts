import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReusableModalComponent } from './reusable-modal.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ReusableModalComponent', () => {
  let component: ReusableModalComponent;
  let fixture: ComponentFixture<ReusableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableModalComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReusableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the modal text', () => {
    fixture.componentRef.setInput('modalText', '¿Estás seguro de continuar?');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.modal-body p');
    expect(text.textContent).toContain('¿Estás seguro de continuar?');
  });

  it('should emit accepted event when accept button is clicked', () => {
    spyOn(component.accepted, 'emit');
    component.onAccept(); // Llama directamente al método
    expect(component.accepted.emit).toHaveBeenCalled();
  });

  it('should emit canceled event when cancel button is clicked', () => {
    spyOn(component.canceled, 'emit');
    component.onCancel(); // Llama directamente al método
    expect(component.canceled.emit).toHaveBeenCalled();
  });
});
