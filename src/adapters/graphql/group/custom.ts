import type { GraphqlItemVariant, MenuGroupConfig } from '../../../types/graphql.js';
import type { ApiItem } from '../../../types/store.js';

import { itemVariant } from '../../../types/common.js';
import { getItemDoesNotMatchAnyGroupErrorMessage } from './errors.js';
import { buildDirectiveItems } from '../items/directive/item.js';
import { buildQueryItems } from '../items/query/item.js';
import { buildMutationItems } from '../items/mutation/item.js';
import { buildSubscriptionItems } from '../items/subscription/item.js';
import { buildObjectItems } from '../items/object/item.js';
import { buildEnumItems } from '../items/enum/item.js';
import { buildScalarItems } from '../items/scalar/item.js';
import { buildInputItems } from '../items/input/item.js';
import { buildUnionItems } from '../items/union/item.js';
import { buildInterfaceItems } from '../items/interface/item.js';
import { createGroup } from './utils.js';
import { graphqlContext } from '../buildContext.js';
import { joinWithSeparator } from '../../../utils/url.js';
import { safeSlugify } from '../../../utils/string.js';
import { DEFAULT_GROUP_LABELS, GRAPHQL_VARIANTS } from '../utils/constants.js';
import { GRAPHQL_MENU_GROUP_ITEM_BUILDERS } from './itemBuilders.js';

export function groupByCustomMenu(): ApiItem[] {
  const { menuConfig } = graphqlContext.get();
  if (!menuConfig?.groups) return [];

  const groups: ApiItem[] = [];
  const processedItems = new Set<string>();

  for (const groupConfig of menuConfig.groups) {
    const group = buildCustomGroup(groupConfig, processedItems);
    if (group) groups.push(group);
  }

  if (menuConfig.requireExactGroups) {
    const ungroupedItem = findFirstUngroupedItem(processedItems);
    if (ungroupedItem) {
      throw new Error(getItemDoesNotMatchAnyGroupErrorMessage(ungroupedItem));
    }
  } else {
    const otherGroup = buildOtherGroup(processedItems);
    if (otherGroup) groups.push(otherGroup);
  }

  return groups;
}

function findFirstUngroupedItem(processedItems: Set<string>): string | undefined {
  for (const variant of GRAPHQL_VARIANTS) {
    const [item] = GRAPHQL_MENU_GROUP_ITEM_BUILDERS[variant]({ processedItems });
    if (item) {
      return `${ungroupedItemKind(variant)} ${item.label}`;
    }
  }

  return undefined;
}

function ungroupedItemKind(variant: GraphqlItemVariant): string {
  if (
    variant === itemVariant.QUERY ||
    variant === itemVariant.MUTATION ||
    variant === itemVariant.SUBSCRIPTION
  ) {
    return 'Operation';
  }
  if (variant === itemVariant.DIRECTIVE) {
    return 'Directive';
  }
  return 'Type';
}

function buildCustomGroup(
  groupConfig: MenuGroupConfig,
  processedItems: Set<string>,
): ApiItem | null {
  const menuCommonFilter = groupConfig.items;
  const common = menuCommonFilter;
  const typeFilter = groupConfig.types;
  const items: ApiItem[] = [];
  const context = graphqlContext.get();
  const parentPath = joinWithSeparator(
    context.basePath,
    safeSlugify(groupConfig.name?.toLowerCase()),
  );

  const appendBuiltItems = (enabled: boolean, build: () => ApiItem[]): void => {
    if (!enabled) return;
    const built = build();
    if (built.length > 0) {
      items.push(...built);
    }
  };

  const orderedBuildKeys = Object.entries(groupConfig)
    .map(([key]) => key)
    .filter(isCustomGroupBuildKey);

  if (common) {
    const defaultBuildKeys: CustomGroupBuildKey[] = [
      'queries',
      'mutations',
      'subscriptions',
      'directives',
      'types',
    ];
    for (const key of defaultBuildKeys) {
      if (!orderedBuildKeys.includes(key)) {
        orderedBuildKeys.push(key);
      }
    }
  }

  for (const key of orderedBuildKeys) {
    switch (key) {
      case 'queries':
        appendBuiltItems(!!(groupConfig.queries || common), () =>
          buildQueryItems({
            filter: groupConfig.queries,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
        );
        break;
      case 'mutations':
        appendBuiltItems(!!(groupConfig.mutations || common), () =>
          buildMutationItems({
            filter: groupConfig.mutations,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
        );
        break;
      case 'subscriptions':
        appendBuiltItems(!!(groupConfig.subscriptions || common), () =>
          buildSubscriptionItems({
            filter: groupConfig.subscriptions,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
        );
        break;
      case 'directives':
        appendBuiltItems(!!(groupConfig.directives || common), () =>
          buildDirectiveItems({
            filter: groupConfig.directives,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
        );
        break;
      case 'types':
        appendBuiltItems(!!(typeFilter || common), () => [
          ...buildObjectItems({
            filter: typeFilter,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
          ...buildInterfaceItems({
            filter: typeFilter,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
          ...buildUnionItems({
            filter: typeFilter,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
          ...buildEnumItems({
            filter: typeFilter,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
          ...buildInputItems({
            filter: typeFilter,
            processedItems,
            menuCommonFilter: common,
            parentPath,
          }),
          ...buildScalarItems({
            filter: typeFilter,
            processedItems,
            menuCommonFilter: common,
          }),
        ]);
        break;
    }
  }

  if (items.length === 0) return null;

  return createGroup({ label: groupConfig.name, items });
}

function buildOtherGroup(processedItems: Set<string>): ApiItem | null {
  const context = graphqlContext.get();
  const groupName = context.menuConfig?.otherItemsGroupName || 'Other';
  const parentPath = joinWithSeparator(context.basePath, safeSlugify(groupName?.toLowerCase()));
  const items: ApiItem[] = [];

  for (const typeGroup of GRAPHQL_VARIANTS) {
    const groupItems = GRAPHQL_MENU_GROUP_ITEM_BUILDERS[typeGroup]({
      processedItems,
      parentPath: joinWithSeparator(
        parentPath,
        safeSlugify(DEFAULT_GROUP_LABELS[typeGroup]?.toLowerCase()),
      ),
    });
    if (groupItems.length > 0) {
      items.push(
        createGroup({
          parentPath,
          typeGroup,
          items: groupItems,
        }),
      );
    }
  }

  if (items.length === 0) return null;
  return createGroup({ label: groupName, items });
}

type CustomGroupBuildKey = 'queries' | 'mutations' | 'subscriptions' | 'directives' | 'types';

function isCustomGroupBuildKey(key: string): key is CustomGroupBuildKey {
  return (
    key === 'queries' ||
    key === 'mutations' ||
    key === 'subscriptions' ||
    key === 'directives' ||
    key === 'types'
  );
}
