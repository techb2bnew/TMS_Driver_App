export const APP_NAME = 'TMS Driver';
export const APP_VERSION = '1.0.0';

export const LoginText = {
  title: 'Welcome back',
  subtitle: 'Sign in to start your shift',
  emailLabel: 'Email',
  emailPlaceholder: 'you@company.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  rememberMe: 'Remember me',
  forgotPassword: 'Forgot password?',
  signIn: 'Sign In',
  footerLine1: 'Driver access only',
  footerLine2: 'Accounts are provisioned by your fleet admin',
  errorTitle: 'Login failed',
  errorMessage: 'The email or password you entered is incorrect. Please try again.',
  errorConfirm: 'Try Again',
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordTooShort: 'Password is too short',
};

export const ProfileText = {
  accountSection: 'Account',
  legalSection: 'Legal & Support',
  dangerSection: 'Danger Zone',
  licenseLabel: 'License',
  phoneLabel: 'Phone',
  truckLabel: 'Truck',
  truckUnassigned: 'Not assigned',
  earnings: 'Earnings & Settlements',
  expenses: 'Expenses',
  settings: 'Settings',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
  contactSupport: 'Contact Support',
  deleteAccount: 'Delete Account',
  logOut: 'Log Out',
  deleteTitle: 'Delete account?',
  deleteMessage:
    "This sends a permanent deletion request to your fleet admin for review — your profile, trip history, and settlements will be removed once it's processed. This isn't immediate, but it can't be undone once actioned.",
  logoutTitle: 'Log out?',
  logoutMessage: "You'll need to sign in again to start your next shift.",
  deleteSuccessTitle: 'Request submitted',
  deleteSuccessMessage: "Your account deletion request has been sent to your fleet admin. You'll be signed out now.",
  doneLabel: 'Done',
};

export const SplashText = {
  subtitle: 'Every load, every mile, in your pocket.',
};

export const HomeText = {
  welcomeBack: 'Welcome back',
  defaultDriverName: 'Driver',
  currentStatus: 'Current status',
  currentLoad: 'Current load',
  allCaughtUp: "You're all caught up",
  viewRoute: 'View route →',
  viewDetails: 'View details',
  noActiveLoad: 'No active load — check the Loads tab for new assignments.',
  delivered: 'Delivered',
  pendingPayout: 'Pending payout',
};

export const NotificationsText = {
  title: 'Notifications',
  allCaughtUp: 'All caught up',
  unreadSuffix: 'unread',
  emptyTitle: 'No notifications',
  emptySubtitle: "You're all caught up for now",
};

export const LoadDetailText = {
  noContactOnFile: 'No contact on file',
  route: 'Route',
  viewFullRoute: 'View Full Route →',
  cargoDetails: 'Cargo details',
  weight: 'Weight',
  rate: 'Rate',
  kgSuffix: 'kg',
  podTitle: 'Proof of Delivery',
  documentsTitle: 'Documents',
  noDocuments: 'No documents attached to this load yet',
  documentTypes: {
    rate_confirmation: 'Rate Confirmation',
    bol: 'Bill of Lading',
    other: 'Document',
  },
  addExpense: 'Add Expense',
};

export const LoadsText = {
  title: 'My Loads',
  loadsAssignedSuffix: 'loads assigned to you',
  emptyTitle: 'No loads here',
  emptySubtitle: 'Try a different filter',
  kgSuffix: 'kg',
  filters: {
    all: 'All',
    assigned: 'Assigned',
    pickedUp: 'Picked Up',
    inTransit: 'In Transit',
    delivered: 'Delivered',
  },
};

export const RouteMapText = {
  title: 'Route',
  remaining: 'Remaining',
  eta: 'ETA',
  total: 'Total',
  tripCompleteSuffix: '% of the trip completed',
  navigateToPrefix: 'Navigate to ',
  stops: 'Stops',
  addStop: '+ Add Stop',
  viewLoadDetails: 'View Load Details',
};

export const AddStopText = {
  title: 'Add Stop',
  categoryLabel: 'Reason',
  categories: {
    fuel: 'Fuel',
    rest: 'Rest',
    breakdown: 'Breakdown',
    other: 'Other',
  },
  addressLabel: 'Location',
  addressPlaceholder: 'e.g. NH48 Dhaba, Neemrana',
  notesLabel: 'Notes (optional)',
  notesPlaceholder: 'e.g. Quick fuel + break',
  addressRequired: 'Enter a location',
  submit: 'Add Stop',
};

export const StopDetailsText = {
  eta: 'ETA',
  distanceFromPrevious: 'Distance from previous',
  contact: 'Contact',
  phone: 'Phone',
  openInMaps: 'Open in Maps',
  kmSuffix: 'km',
};

export const LogHistoryText = {
  title: 'Duty History',
  subtitle: 'Last 7 days',
  hoursSuffix: 'h',
};

export const LogsText = {
  title: 'Duty Status',
  subtitle: 'Tap a status to log the change',
  todaysLog: "Today's log",
  history: 'History →',
  breakRestrictedTitle: 'Break not available yet',
  breakRestrictedMessage: (minutes, km) =>
    `You need to drive a bit longer on this trip before taking a break — at least ${minutes} more minute(s) or ${km} more km, whichever comes later.`,
  breakRestrictedConfirm: 'Got it',
};

export const ContactSupportText = {
  title: 'Contact Support',
  subtitle: 'We usually reply within a few hours',
  supportPhoneLabel: '+91 11 4000 1234',
  supportEmailLabel: 'support@tmsdriver.com',
  open: 'Open',
  sendMessage: 'Send a message',
  subjectLabel: 'Subject',
  subjectPlaceholder: 'What do you need help with?',
  messageLabel: 'Message',
  messagePlaceholder: 'Describe the issue in a few sentences...',
  validationError: 'Please fill in both fields before submitting',
  submitRequest: 'Submit Request',
  successTitle: 'Request sent',
  successMessage: 'Your support request has been submitted. Our team will get back to you shortly.',
  doneLabel: 'Done',
};

export const EarningsText = {
  title: 'Earnings',
  subtitle: 'Your settlement history',
  totalPaid: 'Total paid',
  pending: 'Pending',
  paidLabel: 'Paid',
  unpaidLabel: 'Unpaid',
  emptyTitle: 'No settlements here',
  emptySubtitle: 'Try a different filter',
  filters: {
    all: 'All',
    paid: 'Paid',
    unpaid: 'Unpaid',
  },
};

export const ExpensesText = {
  title: 'Expenses',
  subtitle: 'Your submitted expense claims',
  totalThisMonth: 'This month',
  pendingLabel: 'Pending',
  approvedLabel: 'Approved',
  rejectedLabel: 'Rejected',
  emptyTitle: 'No expenses yet',
  emptySubtitle: 'Tap + to log your first expense',
  filters: {
    all: 'All',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  },
  categories: {
    Fuel: 'Fuel',
    Tolls: 'Tolls',
    Maintenance: 'Maintenance',
    Insurance: 'Insurance',
    Other: 'Other',
  },
  form: {
    title: 'Add Expense',
    categoryLabel: 'Category',
    amountLabel: 'Amount',
    amountPlaceholder: 'e.g. 3200',
    notesLabel: 'Notes (optional)',
    notesPlaceholder: 'e.g. Full tank before trip',
    amountRequired: 'Enter a valid amount',
    submit: 'Submit Expense',
    successTitle: 'Expense submitted',
    successMessage: "Your expense has been sent to your fleet admin for approval.",
    doneLabel: 'Done',
  },
};

export const SettingsText = {
  title: 'Settings',
  preferences: 'Preferences',
  pushNotifications: 'Push notifications',
  tripAlerts: 'Trip alerts',
  support: 'Support',
  contactDispatch: 'Contact dispatch',
  helpCentre: 'Help centre',
  reportIssue: 'Report an issue',
  about: 'About',
  version: 'v1.0.0',
};

export const PrivacyPolicyText = {
  title: 'Privacy Policy',
  updatedAt: '1 September 2026',
};

export const TermsOfServiceText = {
  title: 'Terms of Service',
  updatedAt: '1 September 2026',
};

export const AlertModalText = {
  defaultConfirmLabel: 'OK',
};

export const ConfirmModalText = {
  defaultCancelLabel: 'Cancel',
};

export const ForgotPasswordText = {
  title: 'Reset password',
  phoneRequiredError: 'Enter your registered phone number',
  sentMessage: 'Reset instructions have been sent to your registered number. Please check your SMS shortly.',
  doneLabel: 'Done',
  enterMessage: "Enter the phone number linked to your driver account — we'll send reset instructions to it.",
  phoneLabel: 'Phone number',
  phonePlaceholder: '90000 11122',
  sendResetLink: 'Send Reset Link',
};

export const LegalContentText = {
  updatedPrefix: 'Last updated ',
};

export const NotificationBellText = {
  overflowLabel: '9+',
};

export const RouteTimelineText = {
  kmFromPreviousSuffix: 'km from previous stop',
};

export const StatusUpdateSheetText = {
  addProofOfDeliveryMessage: loadId => `Add proof of delivery for ${loadId} before confirming.`,
  markAsMessage: (loadId, action) => `Mark ${loadId} as ${action}?`,
  proofOfDeliveryAdded: 'Proof of delivery added',
  tapToCapture: 'Tap to capture photo',
  retake: 'Retake',
  cameraError: "Couldn't open the camera. Check camera permission in Settings and try again.",
  cancelLabel: 'Cancel',
};
