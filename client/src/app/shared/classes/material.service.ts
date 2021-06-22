import {ElementRef} from "@angular/core";

declare const M: any;

export interface MaterialInstance{
  open(): void
  close(): void
  destroy(): void
}

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message})
  }

  static initializeFroatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(ref: ElementRef): MaterialInstance{
    return M.Modal.init(ref.nativeElement)
  }
}
