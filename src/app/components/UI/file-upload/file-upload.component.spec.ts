import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.acceptedTypes = ['bmp'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read files from drop event', (done) => {
    component.onChange.subscribe((e) => {
      expect(e[0].name).toBe('file1.bmp');
      expect(e[1].name).toBe('file2.bmp');
      done();
    });
    const dt = new DataTransfer();
    dt.items.add(new File([], 'file1.bmp'));
    dt.items.add(new File([], 'file2.bmp'));

    component.handleDrop(new DragEvent('drop', { dataTransfer: dt }));
  });

  it('should reject files with extensions not in acceptedTypes input', (done) => {
    component.acceptedTypes = [];
    component.onChange.subscribe((e) => {
      expect(e.length).toBe(0);
      done();
    });
    const dt = new DataTransfer();

    dt.items.add(new File([], 'file.bmp'));
    component.handleDrop(new DragEvent('drop', { dataTransfer: dt }));
  });
});
