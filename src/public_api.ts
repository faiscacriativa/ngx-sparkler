export * from "./lib/helpers/index";

export {
  AUTH_LOG_IN_ENDPOINT,
  AUTH_LOG_OUT_ENDPOINT,
  AUTH_REFRESH_TOKEN_ENDPOINT,
  AUTH_SIGN_UP_ENDPOINT,
  AUTH_USER_PROFILE_ENDPOINT,
  EMAIL_VERIFICATION_ENDPOINT,
  EMAIL_VERIFICATION_RESEND_ENDPOINT,
  EMAIL_VERIFICATION_ROUTE,
  IGNORE_REDIRECT_FROM,
  LOG_IN_ROUTE,
  PASSWORD_RESET_ENDPOINT,
  PASSWORD_RESET_REQUEST_ENDPOINT,
  PASSWORD_RESET_REQUEST_ROUTE,
  PASSWORD_RESET_TOKEN_VALIDATION_ENDPOINT,
  SIGN_UP_ROUTE,
  USER_DASHBOARD_ROUTE,

  AccessToken,
  Credentials,
  Profile,
  User,

  ChangePasswordComponent,
  EmailVerifierComponent,
  LoginComponent,
  PasswordResetComponent,

  AuthenticatedGuard,
  NonAuthenticatedGuard,
  UserNotVerifiedGuard,
  UserVerifiedGuard,

  AuthenticationService,
  EmailVerificationService,
  PasswordService,

  SparklerAuthModule
} from "./lib/auth/index";

export {
  API_URL,

  ApiResponse,
  HttpOptions,

  PhoneFamily,
  TabletFamily,

  PageNotFoundComponent,

  HttpService,
  PlatformService,
  UrlService,

  convertToUTCDate,
  getUTCTime,

  SparklerCoreModule
} from "./lib/core/index";

export {
  dateValidator,
  emailValidator,
  telephoneValidator,
  valueMatchValidator,

  DatepickerOptions,
  SelectOption,

  FormUtilitiesService,

  SparklerFormsModule
} from "./lib/forms/index";

export {
  APP_DEFAULT_LANGUAGE,
  APP_LANGUAGES,
  LANGUAGE_INITIALIZED,
  LANGUAGE_NAMES,
  TRANSLATE_LOADER_PROVIDER,

  SparklerI18nModule
} from "./lib/i18n/index";

export {
  LOADING_OVERLAY_CLASS_NAME,
  LOADING_OVERLAY_HIDDEN_CLASS_NAME,
  LOADING_OVERLAY_SHOWN_CLASS_NAME,
  LOADING_OVERLAYED_CLASS_NAME,

  BackButtonComponent,

  DialogService,
  LoadingService,

  SparklerUiModule
} from "./lib/ui/index";
