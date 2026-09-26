export type LegalSection = {
  heading: string;
  body: string;
};

// Placeholder copy — swap for the company's final legal text before release.
export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    heading: '1. Information we collect',
    body: 'We collect your name, phone number, license details, and truck assignment to operate your driver account. While you are on duty, we collect live location data to power load tracking and route features.',
  },
  {
    heading: '2. How we use your information',
    body: 'Your information is used to assign loads, track deliveries, calculate settlements, and communicate trip updates. Location data is only collected while you are actively on a shift.',
  },
  {
    heading: '3. Data sharing',
    body: 'Your live location and load status are shared with your fleet admin and the relevant customer for the duration of an active delivery. We do not sell your personal data to third parties.',
  },
  {
    heading: '4. Data retention',
    body: 'Trip history, settlements, and delivery records are retained for as long as your driver account is active, and for a reasonable period afterward for accounting and compliance purposes.',
  },
  {
    heading: '5. Your rights',
    body: 'You can request a copy of your data or ask for your account to be deleted at any time from the Account screen. Deletion requests are reviewed by your fleet administrator.',
  },
  {
    heading: '6. Contact us',
    body: 'For any privacy-related questions, reach out to your fleet admin through the Contact Support screen in the app.',
  },
];

export const TERMS_OF_SERVICE_SECTIONS: LegalSection[] = [
  {
    heading: '1. Acceptance of terms',
    body: 'By using this driver app, you agree to operate your vehicle safely, follow all applicable transport regulations, and keep your load and delivery status accurate and up to date.',
  },
  {
    heading: '2. Account access',
    body: 'Driver accounts are created and managed by your fleet administrator. You are responsible for keeping your login credentials confidential.',
  },
  {
    heading: '3. Use of the app',
    body: 'The app is provided to help you manage assigned loads, log duty status, and track routes. Misuse of the app, including falsifying delivery or duty status records, may result in account suspension.',
  },
  {
    heading: '4. Location tracking',
    body: 'While on duty, the app shares your live location with your fleet admin to support dispatch and tracking. You can review this in the Privacy Policy.',
  },
  {
    heading: '5. Liability',
    body: 'This app assists with logistics coordination but does not replace your responsibility to drive safely and comply with all traffic and transport laws.',
  },
  {
    heading: '6. Changes to these terms',
    body: 'These terms may be updated from time to time. Continued use of the app after changes are published constitutes acceptance of the updated terms.',
  },
];
