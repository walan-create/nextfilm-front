import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRentalComponent } from './update-rental.component';

describe('UpdateRentalComponent', () => {
  let component: UpdateRentalComponent;
  let fixture: ComponentFixture<UpdateRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
