import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const SECTION = {
  produceRideRequest: '/asyncapi/rides/topics/ride-requests/operations/publishriderequest',
  publishLocationUpdates: '/asyncapi/topics/driver-location/operations/publishlocationupdates',
  produceDriverMatch: '/asyncapi/rides/topics/ride-matches/operations/publishdrivermatch',
} as const;

test.describe('AsyncAPI scroll stack', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test.describe('overview', () => {
    test('scrolling from overview mounts untagged operations before tagged ride operations', async ({
      page,
    }) => {
      await goto(page, '/asyncapi');
      await apiDocs.waitForPageLoad();

      await apiDocs.scrollUntilHeadingVisible('Produce Location Updates');
      await expect(apiDocs.getOperationSection(SECTION.publishLocationUpdates)).toBeVisible();

      await apiDocs.expectOperationSectionAbsent(SECTION.produceRideRequest);
    });
  });

  test.describe('tag hub (GROUP content)', () => {
    test('Topics panel navigates to a channel without flattening the tag hub', async ({ page }) => {
      await goto(page, '/asyncapi/rides');
      await apiDocs.waitForPageLoad();

      await expect(page).toHaveURL(/\/asyncapi\/rides\/?$/);

      const topicsList = apiDocs.getTopicsNavigationList().first();
      await expect(topicsList.getByText('Topics', { exact: true })).toBeVisible();
      await expect(topicsList.getByText('Ride Requests Topic', { exact: true })).toBeVisible();

      await topicsList.getByText('Ride Requests Topic', { exact: true }).click();
      await expect(page).toHaveURL(/\/asyncapi\/rides\/topics\/ride-requests\/?$/);
      await apiDocs.waitForChannelLoad('Ride Requests Topic');
    });
  });

  test.describe('tagged channels under Rides', () => {
    test('Ride Matching: scrolling up mounts sibling Ride Requests operations', async ({
      page,
    }) => {
      await goto(page, '/asyncapi/rides/topics/ride-matches');
      await apiDocs.waitForPageLoad();
      await apiDocs.waitForChannelLoad('Ride Matching Topic');

      await apiDocs.expectOperationSectionMountable(
        SECTION.produceRideRequest,
        'Produce Ride Request',
        { direction: 'up' },
      );
    });

    test('Ride Requests: scrolling down mounts sibling Ride Matching operations', async ({
      page,
    }) => {
      await goto(page, '/asyncapi/rides/topics/ride-requests');
      await apiDocs.waitForPageLoad();
      await apiDocs.waitForChannelLoad('Ride Requests Topic');

      await apiDocs.expectOperationSectionNotInViewport(SECTION.produceDriverMatch);

      await apiDocs.scrollUntilHeadingVisible('Produce Driver Match');
      await expect(apiDocs.getOperationSection(SECTION.produceDriverMatch)).toBeVisible();
    });
  });

  test.describe('untagged top-level channels', () => {
    test('User Ratings: scrolling up mounts sibling Driver Location operations', async ({
      page,
    }) => {
      await goto(page, '/asyncapi/topics/ratings');
      await apiDocs.waitForPageLoad();
      await apiDocs.waitForChannelLoad('User Ratings Topic');

      await apiDocs.expectOperationSectionMountable(
        SECTION.publishLocationUpdates,
        'Produce Location Updates',
        { direction: 'up' },
      );
    });
  });
});
