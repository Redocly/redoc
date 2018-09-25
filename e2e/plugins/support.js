import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
  customSnapshotsDir: 'e2e/snapshots',
  // disableTimersAndAnimations: false,
});
