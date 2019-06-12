import { Inject, Injectable } from "@angular/core";

import {
  LOADING_OVERLAY_CLASS_NAME,
  LOADING_OVERLAY_HIDDEN_CLASS_NAME,
  LOADING_OVERLAY_SHOWN_CLASS_NAME,
  LOADING_OVERLAYED_CLASS_NAME
} from "../injection-tokens";

@Injectable({
  providedIn: "root"
})
export class LoadingService {

  private readonly body: HTMLBodyElement;
  private readonly element: HTMLElement;
  private instantiations = 0;

  private overlayedClassName: string;
  private overlayHiddenClassName: string;
  private overlayShownClassName: string;

  constructor(
    @Inject(LOADING_OVERLAY_CLASS_NAME) loadingOverlayClassName: string,
    @Inject(LOADING_OVERLAYED_CLASS_NAME) loadingOverlayedClassName: string,
    @Inject(LOADING_OVERLAY_HIDDEN_CLASS_NAME) loadingOverlayHiddenClassName: string,
    @Inject(LOADING_OVERLAY_SHOWN_CLASS_NAME) loadingOverlayShownClassName: string
  ) {
    this.body = document.querySelector("body");
    this.element = document.querySelector("." + loadingOverlayClassName.replace(/^\./, ""));

    this.overlayedClassName = loadingOverlayedClassName;
    this.overlayHiddenClassName = loadingOverlayHiddenClassName;
    this.overlayShownClassName = loadingOverlayShownClassName;
  }

  public show(): void {
    ++this.instantiations;

    if (this.instantiations > 1) {
      return;
    }

    this.body.classList.add(this.overlayedClassName);
    this.element.classList.remove(this.overlayHiddenClassName);
    this.element.classList.add(this.overlayShownClassName);
  }

  public hide(): void {
    --this.instantiations;

    if (this.instantiations > 0) {
      return;
    }

    this.body.classList.remove(this.overlayedClassName);
    this.element.classList.remove(this.overlayShownClassName);
    this.element.classList.add(this.overlayHiddenClassName);
    this.instantiations = 0;
  }

}
