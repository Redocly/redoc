type MatchSnapShotOptions = Cypress.ScreenshotOptions &
  import('jest-image-snapshot').MatchImageSnapshotOptions;

declare namespace Cypress {
  interface Chainable<Subject = any> {
    matchImageSnapshot(name?: string): void;
    matchImageSnapshot(name: string, options: MatchSnapShotOptions): void;
    matchImageSnapshot(options: MatchSnapShotOptions): void;
  }
}
