import { AbstractControl, ValidationErrors } from '@angular/forms';

// Custom validator function used by reactive forms, checks extensions against a whitelist
export function requiredFileType(types: string[]) {
  return function (control: AbstractControl) {
    const files: FileList = control.value;
    if (!files || files.length === 0) return null;

    const fileNames: string[] = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(files[i].name);
    }

    const valid = areFileTypesValid(fileNames, types);

    if (!valid) return { requiredFileType: true } as ValidationErrors;
    return null;
  };
}

// pure comparer function, checks filenames against a whitelist of extensions
export function areFileTypesValid(names: string[], types: string[]) {
  const results: boolean[] = [];
  for (let i = 0; i < names.length; i++) {
    const nameparts = names[i].split('.');
    const extension = nameparts[nameparts.length - 1].toLowerCase();
    let valid = false;

    for (let j = 0; j < types.length; j++) {
      if (types[j].toLowerCase() === extension.toLowerCase()) {
        valid = true;
      }
    }

    if (!valid) return false;
  }
  return true;
}
