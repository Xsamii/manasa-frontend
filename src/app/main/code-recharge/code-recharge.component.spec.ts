import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRechargeComponent } from './code-recharge.component';

describe('CodeRechargeComponent', () => {
  let component: CodeRechargeComponent;
  let fixture: ComponentFixture<CodeRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeRechargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
