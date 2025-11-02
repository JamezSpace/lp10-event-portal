import { ElementRef } from "@angular/core";

function toggleLoader(loader: ElementRef<HTMLDivElement>) {
    if (loader.nativeElement.classList.contains('flex'))
      loader.nativeElement.classList.replace('flex', 'hidden');
    else loader.nativeElement.classList.replace('hidden', 'flex');
}

export {
    toggleLoader
}