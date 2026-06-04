import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourExecutionsListComponent } from './tour-executions-list.component';

describe('TourExecutionsListComponent', () => {
  let component: TourExecutionsListComponent;
  let fixture: ComponentFixture<TourExecutionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourExecutionsListComponent]
    });
    fixture = TestBed.createComponent(TourExecutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
