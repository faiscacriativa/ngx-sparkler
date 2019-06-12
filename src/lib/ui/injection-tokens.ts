import { InjectionToken } from "@angular/core";

export const LOADING_OVERLAY_CLASS_NAME = new InjectionToken<string>("Loading Overlay Class Name");
export const LOADING_OVERLAY_HIDDEN_CLASS_NAME = new InjectionToken<string>("Loading Overlay Hidden Class Name");
export const LOADING_OVERLAY_SHOWN_CLASS_NAME = new InjectionToken<string>("Loading Overlay Shown Class Name");
export const LOADING_OVERLAYED_CLASS_NAME = new InjectionToken<string>("Loading Overlayed Class Name");

export const SPARKLER_UI_DEFAULTS = [
  { provide: LOADING_OVERLAY_CLASS_NAME, useValue: "loading-overlay" },
  { provide: LOADING_OVERLAY_HIDDEN_CLASS_NAME, useValue: "hidden" },
  { provide: LOADING_OVERLAY_SHOWN_CLASS_NAME, useValue: "shown" },
  { provide: LOADING_OVERLAYED_CLASS_NAME, useValue: "overlayed" }
];
