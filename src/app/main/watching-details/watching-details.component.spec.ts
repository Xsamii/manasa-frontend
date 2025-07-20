import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchingDetailsComponent } from './watching-details.component';

describe('WatchingDetailsComponent', () => {
  let component: WatchingDetailsComponent;
  let fixture: ComponentFixture<WatchingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
