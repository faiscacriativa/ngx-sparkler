import { Injectable } from "@angular/core";
import * as MobileDetect from "mobile-detect";
import * as Platform from "platform";

export enum PhoneFamily {
  "iPhone" = "iPhone",
  "BlackBerry" = "BlackBerry",
  "HTC" = "HTC",
  "Nexus" = "Nexus",
  "Dell" = "Dell",
  "Motorola" = "Motorola",
  "Samsung" = "Samsung",
  "LG" = "LG",
  "Sony" = "Sony",
  "Asus" = "Asus",
  "NokiaLumia" = "NokiaLumia",
  "Micromax" = "Micromax",
  "Palm" = "Palm",
  "Vertu" = "Vertu",
  "Pantech" = "Pantech",
  "Fly" = "Fly",
  "Wiko" = "Wiko",
  "iMobile" = "iMobile",
  "SimValley" = "SimValley",
  "Wolfgang" = "Wolfgang",
  "Alcatel" = "Alcatel",
  "Nintendo" = "Nintendo",
  "Amoi" = "Amoi",
  "INQ" = "INQ",
  "GenericPhone" = "GenericPhone",
  "UnknownPhone" = "UnknownPhone"
}

export enum TabletFamily {
  "iPad" = "iPad",
  "NexusTablet" = "NexusTablet",
  "GoogleTablet" = "GoogleTablet",
  "SamsungTablet" = "SamsungTablet",
  "Kindle" = "Kindle",
  "SurfaceTablet" = "SurfaceTablet",
  "HPTablet" = "HPTablet",
  "AsusTablet" = "AsusTablet",
  "BlackBerryTablet" = "BlackBerryTablet",
  "HTCtablet" = "HTCtablet",
  "MotorolaTablet" = "MotorolaTablet",
  "NookTablet" = "NookTablet",
  "AcerTablet" = "AcerTablet",
  "ToshibaTablet" = "ToshibaTablet",
  "LGTablet" = "LGTablet",
  "FujitsuTablet" = "FujitsuTablet",
  "PrestigioTablet" = "PrestigioTablet",
  "LenovoTablet" = "LenovoTablet",
  "DellTablet" = "DellTablet",
  "YarvikTablet" = "YarvikTablet",
  "MedionTablet" = "MedionTablet",
  "ArnovaTablet" = "ArnovaTablet",
  "IntensoTablet" = "IntensoTablet",
  "IRUTablet" = "IRUTablet",
  "MegafonTablet" = "MegafonTablet",
  "EbodaTablet" = "EbodaTablet",
  "AllViewTablet" = "AllViewTablet",
  "ArchosTablet" = "ArchosTablet",
  "AinolTablet" = "AinolTablet",
  "NokiaLumiaTablet" = "NokiaLumiaTablet",
  "SonyTablet" = "SonyTablet",
  "PhilipsTablet" = "PhilipsTablet",
  "CubeTablet" = "CubeTablet",
  "CobyTablet" = "CobyTablet",
  "MIDTablet" = "MIDTablet",
  "MSITablet" = "MSITablet",
  "SMiTTablet" = "SMiTTablet",
  "RockChipTablet" = "RockChipTablet",
  "FlyTablet" = "FlyTablet",
  "bqTablet" = "bqTablet",
  "HuaweiTablet" = "HuaweiTablet",
  "NecTablet" = "NecTablet",
  "PantechTablet" = "PantechTablet",
  "BronchoTablet" = "BronchoTablet",
  "VersusTablet" = "VersusTablet",
  "ZyncTablet" = "ZyncTablet",
  "PositivoTablet" = "PositivoTablet",
  "NabiTablet" = "NabiTablet",
  "KoboTablet" = "KoboTablet",
  "DanewTablet" = "DanewTablet",
  "TexetTablet" = "TexetTablet",
  "PlaystationTablet" = "PlaystationTablet",
  "TrekstorTablet" = "TrekstorTablet",
  "PyleAudioTablet" = "PyleAudioTablet",
  "AdvanTablet" = "AdvanTablet",
  "DanyTechTablet" = "DanyTechTablet",
  "GalapadTablet" = "GalapadTablet",
  "MicromaxTablet" = "MicromaxTablet",
  "KarbonnTablet" = "KarbonnTablet",
  "AllFineTablet" = "AllFineTablet",
  "PROSCANTablet" = "PROSCANTablet",
  "YONESTablet" = "YONESTablet",
  "ChangJiaTablet" = "ChangJiaTablet",
  "GUTablet" = "GUTablet",
  "PointOfViewTablet" = "PointOfViewTablet",
  "OvermaxTablet" = "OvermaxTablet",
  "HCLTablet" = "HCLTablet",
  "DPSTablet" = "DPSTablet",
  "VistureTablet" = "VistureTablet",
  "CrestaTablet" = "CrestaTablet",
  "MediatekTablet" = "MediatekTablet",
  "ConcordeTablet" = "ConcordeTablet",
  "GoCleverTablet" = "GoCleverTablet",
  "ModecomTablet" = "ModecomTablet",
  "VoninoTablet" = "VoninoTablet",
  "ECSTablet" = "ECSTablet",
  "StorexTablet" = "StorexTablet",
  "VodafoneTablet" = "VodafoneTablet",
  "EssentielBTablet" = "EssentielBTablet",
  "RossMoorTablet" = "RossMoorTablet",
  "iMobileTablet" = "iMobileTablet",
  "TolinoTablet" = "TolinoTablet",
  "AudioSonicTablet" = "AudioSonicTablet",
  "AMPETablet" = "AMPETablet",
  "SkkTablet" = "SkkTablet",
  "TecnoTablet" = "TecnoTablet",
  "JXDTablet" = "JXDTablet",
  "iJoyTablet" = "iJoyTablet",
  "FX2Tablet" = "FX2Tablet",
  "XoroTablet" = "XoroTablet",
  "ViewsonicTablet" = "ViewsonicTablet",
  "VerizonTablet" = "VerizonTablet",
  "OdysTablet" = "OdysTablet",
  "CaptivaTablet" = "CaptivaTablet",
  "IconbitTablet" = "IconbitTablet",
  "TeclastTablet" = "TeclastTablet",
  "OndaTablet" = "OndaTablet",
  "JaytechTablet" = "JaytechTablet",
  "BlaupunktTablet" = "BlaupunktTablet",
  "DigmaTablet" = "DigmaTablet",
  "EvolioTablet" = "EvolioTablet",
  "LavaTablet" = "LavaTablet",
  "AocTablet" = "AocTablet",
  "MpmanTablet" = "MpmanTablet",
  "CelkonTablet" = "CelkonTablet",
  "WolderTablet" = "WolderTablet",
  "MediacomTablet" = "MediacomTablet",
  "MiTablet" = "MiTablet",
  "NibiruTablet" = "NibiruTablet",
  "NexoTablet" = "NexoTablet",
  "LeaderTablet" = "LeaderTablet",
  "UbislateTablet" = "UbislateTablet",
  "PocketBookTablet" = "PocketBookTablet",
  "KocasoTablet" = "KocasoTablet",
  "HisenseTablet" = "HisenseTablet",
  "Hudl" = "Hudl",
  "TelstraTablet" = "TelstraTablet",
  "GenericTablet" = "GenericTablet",
  "UnknownTablet" = "UnknownTablet"
}

@Injectable({
  providedIn: "root"
})
export class PlatformService {

  private mobileDetect: MobileDetect;

  constructor() {
    this.mobileDetect = new MobileDetect(this.userAgent());
  }

  public browser(): { name: string, version: string } {
    return {
      name:    Platform.name,
      version: Platform.version
    };
  }

  public isDesktop(): boolean {
    return !!!this.mobile();
  }

  public isMobile(): boolean {
    return !!this.mobile();
  }

  public isPhone(): boolean {
    return !!this.phone();
  }

  public isTablet(): boolean {
    return !!this.tablet();
  }

  public mobile(): string {
    return this.mobileDetect.mobile();
  }

  public os(): any {
    return Platform.os;
  }

  public phone(): string {
    return this.mobileDetect.phone();
  }

  public tablet(): string {
    return this.mobileDetect.tablet();
  }

  public userAgent(): string {
    return window.navigator.userAgent;
  }

}
