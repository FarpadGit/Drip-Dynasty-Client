import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { areFileTypesValid } from '../../../utils/validators';
import { ButtonDirective } from '../../../directives/UI/button.directive';

export type fileUploadType = {
  id: string;
  name: string;
  image: {
    src: string;
    file?: File;
  };
  shouldDelete: boolean;
  existsOnServer?: true;
};

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  imports: [CommonModule, ButtonDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() name: string = '';
  @Input() acceptedTypes: string[] = [];
  @Input() defaultValues?: string[] = [];
  @Output() onChange = new EventEmitter<fileUploadType[]>();
  onReactiveInputChanged: Function | null = null;
  private files: FileList | null = null;
  inDropZone: boolean = false;

  constructor(private host: ElementRef<HTMLInputElement>) {}

  get fileNames() {
    return this.defaultValues?.join(', ');
  }

  emitFiles(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    this.files = files;
    this.handleFilesChanged();
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer?.files;
    if (!droppedFiles) return;
    this.files = droppedFiles;
    this.inDropZone = false;
    this.handleFilesChanged();
  }

  handleFilesChanged() {
    if (!this.files) return;
    this.onReactiveInputChanged?.(this.files);

    let imageNames: string[] = [];
    let imagePromises: Promise<string>[] = [];
    for (let i = 0; i < this.files.length; i++) {
      if (areFileTypesValid([this.files[i].name], this.acceptedTypes)) {
        imageNames.push(this.files[i].name);
        imagePromises.push(this.readFile(this.files[i]).catch(() => 'ERROR'));
      }
    }

    // map files to emitable objects with loading state, then load images asyncronously
    let images: fileUploadType[] = imagePromises.map((_, index) => {
      return {
        id: crypto.randomUUID(),
        name: imageNames[index],
        image: { src: 'LOADING', file: this.files![index] },
        shouldDelete: false,
      };
    });

    // emiting images here will let the host see the loading states,
    // and updating them later will also be visible from the host even without emitting again.
    this.onChange.emit(images);

    imagePromises.forEach(async (promise, index) => {
      images[index].image!.src = await promise;
    });
  }

  // converts File into it's base64 string representation (this can be displayed as an image when assigned to src prop)
  private readFile(file: File) {
    return new Promise<string>((res, rej) => {
      if (
        file.size > 16 * 1024 * 1024 || // size > 16 MB
        !areFileTypesValid([file.name], this.acceptedTypes) // file extension not valid
      ) {
        rej(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        res(reader.result?.toString() || '');
      };
      reader.onerror = () => {
        rej(reader);
      };
      reader.readAsDataURL(file);
    });
  }

  // Functions for bridging component with reactive forms
  writeValue(value: null): void {
    // clear file input
    this.host.nativeElement.value = '';
    this.files = null;
  }
  registerOnChange(fn: Function): void {
    this.onReactiveInputChanged = fn;
  }
  registerOnTouched(fn: Function): void {}
}
