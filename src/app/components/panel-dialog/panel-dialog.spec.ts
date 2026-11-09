import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelDialog } from './panel-dialog';

describe('PanelDialog', () => {
  let component: PanelDialog;
  let fixture: ComponentFixture<PanelDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
