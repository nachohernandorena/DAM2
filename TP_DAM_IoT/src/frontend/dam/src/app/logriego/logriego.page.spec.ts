import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogriegoPage } from './logriego.page';

describe('LogriegoPage', () => {
  let component: LogriegoPage;
  let fixture: ComponentFixture<LogriegoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogriegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
