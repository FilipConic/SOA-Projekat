import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypointModalComponent } from './keypoint-modal.component';

describe('KeypointModalComponent', () => {
  let component: KeypointModalComponent;
  let fixture: ComponentFixture<KeypointModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeypointModalComponent]
    });
    fixture = TestBed.createComponent(KeypointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
