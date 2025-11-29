import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

function toggleLoader(loader: ElementRef<HTMLDivElement>) {
  if (loader.nativeElement.classList.contains('flex'))
    loader.nativeElement.classList.replace('flex', 'hidden');
  else loader.nativeElement.classList.replace('hidden', 'flex');
}

function extractStringValueFromFormControl(form_control: FormControl) {
  return new String(form_control.value).trim().toString() || '';
}

function extractNumberValueFromFormControl(form_control: FormControl) {
  return form_control.value || 0;
}

function extractDateComponentsFromFormControl(form_control: FormControl) {
  const date_data = new Date(form_control.value);

  return { 
    year: date_data.getFullYear(), 
    date: new String(date_data).trim().toString()
 };
}

export {
  toggleLoader,
  extractNumberValueFromFormControl,
  extractStringValueFromFormControl,
  extractDateComponentsFromFormControl,
};
