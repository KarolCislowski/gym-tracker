export const supportedLanguages = ['en', 'pl', 'sv'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export interface TranslationDictionary {
  auth: {
    appName: string;
    homeTitle: string;
    aboutTitle: string;
    signedInAs: string;
    tenantDatabase: string;
    profileTitle: string;
    profileName: string;
    profileEmail: string;
    settingsTitle: string;
    settingsLanguage: string;
    settingsDarkMode: string;
    darkModeEnabled: string;
    darkModeDisabled: string;
    signOut: string;
    signIn: string;
    createAccount: string;
    signInTitle: string;
    signInDescription: string;
    accountDeleted: string;
    registrationSuccess: string;
    emailLabel: string;
    passwordLabel: string;
    signInButton: string;
    newHere: string;
    createAccountLink: string;
    registerTitle: string;
    registerDescription: string;
    firstNameLabel: string;
    lastNameLabel: string;
    languageLabel: string;
    darkModeLabel: string;
    registerButton: string;
    alreadyHaveAccount: string;
    signInLink: string;
    languageEnglish: string;
    languagePolish: string;
    languageSwedish: string;
  };
  dashboard: {
    appName: string;
    overview: string;
    profile: string;
    settings: string;
    workspace: string;
    openNavigation: string;
    collapseNavigation: string;
    expandNavigation: string;
    welcomeBack: string;
    workspaceReady: string;
    tenantDatabase: string;
    profileName: string;
    profileEmail: string;
    settingsLanguage: string;
    settingsTheme: string;
    themeDark: string;
    themeLight: string;
    signOut: string;
  };
  settings: {
    title: string;
    description: string;
    preferencesTitle: string;
    preferencesDescription: string;
    languageLabel: string;
    darkModeLabel: string;
    savePreferences: string;
    preferencesUpdated: string;
    securityTitle: string;
    securityDescription: string;
    currentPasswordLabel: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    changePassword: string;
    passwordUpdated: string;
    dangerZoneTitle: string;
    dangerZoneDescription: string;
    deleteAccountWarning: string;
    confirmationEmailLabel: string;
    confirmationEmailHelp: string;
    deleteAccount: string;
    accountDeleted: string;
    errorGeneric: string;
    errorInvalidCurrentPassword: string;
    errorPasswordConfirmationMismatch: string;
    errorConfirmationEmailMismatch: string;
  };
}

export interface TranslationDictionaryOverrides {
  auth?: Partial<TranslationDictionary['auth']>;
  dashboard?: Partial<TranslationDictionary['dashboard']>;
  settings?: Partial<TranslationDictionary['settings']>;
}
