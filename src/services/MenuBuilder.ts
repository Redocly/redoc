import { OpenAPIParser } from './OpenAPIParser';
import { GroupModel, OperationModel } from './models';
import { JsonPointer, isOperationName } from '../utils';
import { OpenAPIOperation, OpenAPIParameter, OpenAPISpec, OpenAPITag, Referenced } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';

export type TagInfo = OpenAPITag & {
  operations: ExtendedOpenAPIOperation[];
  used?: boolean;
};

export type ExtendedOpenAPIOperation = {
  _$ref: string;
  httpVerb: string;
  pathParameters: Referenced<OpenAPIParameter>[];
} & OpenAPIOperation;

export type TagsInfoMap = Dict<TagInfo>;

export interface TagGroup {
  name: string;
  tags: string[];
}

export const GROUP_DEPTH = 0;
export type ContentItemModel = GroupModel | OperationModel;

export class MenuBuilder {
  /**
   * Builds page content structure based on tags
   */
  static buildStructure(
    parser: OpenAPIParser,
    options: RedocNormalizedOptions,
  ): ContentItemModel[] {
    const spec = parser.spec;

    const items: ContentItemModel[] = [];
    const tagsMap = MenuBuilder.getTagsWithOperations(spec);
    items.push(...MenuBuilder.addMarkdownItems(spec.info.description || ''));
    if (spec['x-tagGroups']) {
      items.push(
        ...MenuBuilder.getTagGroupsItems(parser, undefined, spec['x-tagGroups'], tagsMap, options),
      );
    } else {
      items.push(...MenuBuilder.getTagsItems(parser, tagsMap, undefined, undefined, options));
    }
    return items;
  }

  /**
   * extracts items from markdown description
   * @param description - markdown source
   */
  static addMarkdownItems(description: string): ContentItemModel[] {
    const renderer = new MarkdownRenderer();
    const headings = renderer.extractHeadings(description || '');
    return headings;
  }

  /**
   * Returns array of OperationsGroup items for the tag groups (x-tagGroups vendor extenstion)
   * @param tags value of `x-tagGroups` vendor extension
   */
  static getTagGroupsItems(
    parser: OpenAPIParser,
    parent: GroupModel | undefined,
    groups: TagGroup[],
    tags: TagsInfoMap,
    options: RedocNormalizedOptions,
  ): GroupModel[] {
    let res: GroupModel[] = [];
    for (let group of groups) {
      let item = new GroupModel('group', group, parent);
      item.depth = GROUP_DEPTH;
      item.items = MenuBuilder.getTagsItems(parser, tags, item, group, options);
      res.push(item);
    }
    // TODO checkAllTagsUsedInGroups
    return res;
  }

  /**
   * Returns array of OperationsGroup items for the tags of the group or for all tags
   * @param tagsMap tags info returned from `getTagsWithOperations`
   * @param parent parent item
   * @param group group which this tag belongs to. if not provided gets all tags
   */
  static getTagsItems(
    parser: OpenAPIParser,
    tagsMap: TagsInfoMap,
    parent: GroupModel | undefined,
    group: TagGroup | undefined,
    options: RedocNormalizedOptions,
  ): ContentItemModel[] {
    let tagNames;

    if (group === undefined) {
      tagNames = Object.keys(tagsMap); // all tags
    } else {
      tagNames = group.tags;
    }

    const tags = tagNames.map(tagName => {
      if (!tagsMap[tagName]) {
        console.warn(`Non-existing tag "${tagName}" is added to the group "${group!.name}"`);
        return null;
      }
      tagsMap[tagName].used = true;
      return tagsMap[tagName];
    });

    let res: (GroupModel | OperationModel)[] = [];
    for (let tag of tags) {
      if (!tag) continue;
      let item = new GroupModel('tag', tag, parent);
      item.depth = GROUP_DEPTH + 1;
      item.items = this.getOperationsItems(parser, item, tag, item.depth + 1, options);

      // don't put empty tag into content, instead put its operations
      if (tag.name === '') {
        let items = this.getOperationsItems(parser, undefined, tag, item.depth + 1, options);
        res.push(...items);
        continue;
      }

      res.push(item);
    }
    return res;
  }

  /**
   * Returns array of Operation items for the tag
   * @param parent parent OperationsGroup
   * @param tag tag info returned from `getTagsWithOperations`
   * @param depth items depth
   */
  static getOperationsItems(
    parser: OpenAPIParser,
    parent: GroupModel | undefined,
    tag: TagInfo,
    depth: number,
    options: RedocNormalizedOptions,
  ): OperationModel[] {
    if (tag.operations.length === 0) {
      return [];
    }

    let res: OperationModel[] = [];
    for (let operationInfo of tag.operations) {
      let operation = new OperationModel(parser, operationInfo, parent, options);
      operation.depth = depth;
      res.push(operation);
    }
    return res;
  }

  /**
   * collects tags and maps each tag to list of operations belonging to this tag
   */
  static getTagsWithOperations(spec: OpenAPISpec): TagsInfoMap {
    const tags: TagsInfoMap = {};
    for (let tag of spec.tags || []) {
      tags[tag.name] = Object.assign(tag);
      tags[tag.name].operations = [];
    }

    const paths = spec.paths;
    for (let pathName of Object.keys(paths)) {
      const path = paths[pathName];
      const operations = Object.keys(path).filter(isOperationName);
      for (let operationName of operations) {
        const operationInfo = path[operationName];
        let operationTags = operationInfo.tags;

        if (!operationTags || !operationTags.length) {
          // empty tag
          operationTags = [''];
        }
        const operationPointer = JsonPointer.compile(['paths', pathName, operationName]);
        for (let tagName of operationTags) {
          let tag = tags[tagName];
          if (tag === undefined) {
            tag = {
              name: tagName,
              operations: [],
            };
            tags[tagName] = tag;
          }
          if (tag['x-traitTag']) continue;
          tag.operations.push({
            ...operationInfo,
            _$ref: operationPointer,
            httpVerb: operationName,
            pathParameters: path.parameters || [],
          });
        }
      }
    }

    return tags;
  }
}
