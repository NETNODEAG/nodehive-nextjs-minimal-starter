/// <reference types="node" />
export declare type Locale = string;
export declare type JsonApiOptions = {
  deserialize?: boolean;
  params?: JsonApiParams;
};
export declare type JsonApiWithLocaleOptions = JsonApiOptions &
  (
    | {
        locale: Locale;
        defaultLocale: Locale;
      }
    | {
        locale?: undefined;
        defaultLocale?: never;
      }
  );
export declare type JsonApiParams = Record<string, any>;
export interface JsonApiError {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  links?: JsonApiLinks;
}
export interface JsonApiLinks {
  [key: string]: string | Record<string, string>;
}
export interface JsonApiResponse extends Record<string, any> {
  jsonapi?: {
    version: string;
    meta: Record<string, any>[];
  };
  data: Record<string, any>[];
  errors: JsonApiError[];
  meta: {
    count: number;
    [key: string]: any;
  };
  links?: JsonApiLinks;
  included?: Record<string, any>[];
}
export interface JsonApiResourceBodyRelationship {
  data: {
    type: string;
    id: string;
  };
}
export interface JsonApiCreateResourceBody {
  data: {
    type?: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, JsonApiResourceBodyRelationship>;
  };
}
export interface JsonApiCreateFileResourceBody {
  data: {
    type?: string;
    attributes: {
      type: string;
      field: string;
      filename: string;
      file: Buffer;
    };
  };
}
export interface JsonApiUpdateResourceBody {
  data: {
    type?: string;
    id?: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, JsonApiResourceBodyRelationship>;
  };
}
export interface JsonApiSearchApiResponse extends JsonApiResponse {
  meta: JsonApiResponse['meta'] & {
    facets?: DrupalSearchApiFacet[];
  };
}
export interface Serializer {
  deserialize(
    body: Record<string, unknown>,
    options?: Record<string, unknown>
  ): unknown;
}
export declare type Fetcher = WindowOrWorkerGlobalScope['fetch'];
export interface DataCache {
  get(key: any): Promise<unknown>;
  set(key: any, value: any, ttl?: number): Promise<unknown>;
  del?(keys: any): Promise<unknown>;
}
export interface FetchOptions extends RequestInit {
  withAuth?: boolean | DrupalClientAuth;
}
export interface DrupalSearchApiFacet {
  id: string;
  label?: string;
  path?: string;
  terms?: {
    url: string;
    values: {
      value: string;
      label: string;
      active?: boolean;
      count?: number;
    };
  }[];
}
export interface DrupalTranslatedPath {
  resolved: string;
  isHomePath: boolean;
  entity: {
    canonical: string;
    type: string;
    bundle: string;
    id: string;
    uuid: string;
    langcode?: string;
    path?: string;
  };
  label?: string;
  jsonapi?: {
    individual: string;
    resourceName: string;
    pathPrefix: string;
    basePath: string;
    entryPoint: string;
  };
  meta?: Record<string, unknown>;
  redirect?: {
    from: string;
    to: string;
    status: string;
  }[];
}
export interface DrupalMenuLinkContent {
  description: string;
  enabled: boolean;
  expanded: boolean;
  id: string;
  menu_name: string;
  meta: Record<string, unknown>;
  options: Record<string, unknown>;
  parent: string;
  provider: string;
  route: {
    name: string;
    parameters: Record<string, unknown>;
  };
  title: string;
  type: string;
  url: string;
  weight: string;
  items?: DrupalMenuLinkContent[];
}
export declare type PathAlias = {
  alias: string;
  pid: number;
  langcode: string;
};
export interface JsonApiResource extends Record<string, any> {
  id: string;
  type: string;
  langcode: string;
  status: boolean;
}
export interface JsonApiResourceWithPath extends JsonApiResource {
  path: PathAlias;
}
export declare type GetResourcePreviewUrlOptions = JsonApiWithLocaleOptions & {
  isVersionable?: boolean;
};
export interface DrupalNode extends JsonApiResourceWithPath {
  drupal_internal__nid: number;
  drupal_internal__vid: number;
  changed: string;
  created: string;
  title: string;
  default_langcode: boolean;
  sticky: boolean;
}
export interface DrupalParagraph extends JsonApiResource {
  drupal_internal__id: number;
  drupal_internal__revision_id: number;
}
export interface DrupalBlock extends JsonApiResource {
  info: string;
}
export interface DrupalMedia extends JsonApiResource {
  drupal_internal__mid: string;
  drupal_internal__vid: string;
  changed: string;
  created: string;
  name: string;
}
export interface DrupalFile extends JsonApiResource {
  drupal_internal__fid: string;
  changed: string;
  created: string;
  filename: string;
  uri: {
    value: string;
    url: string;
  };
  filesize: number;
  filemime: string;
  resourceIdObjMeta?: DrupalFileMeta;
}
export interface DrupalFileMeta {
  alt?: string;
  title?: string;
  width: number;
  height: number;
}
export interface DrupalTaxonomyTerm extends JsonApiResourceWithPath {
  drupal_internal__tid: string;
  changed: string;
  default_langcode: boolean;
  name: string;
  description: string;
  weight: number;
}
export interface DrupalUser extends JsonApiResourceWithPath {
  drupal_internal__uid: string;
  changed: string;
  created: string;
  default_langcode: boolean;
  name: string;
}
export interface DrupalView<T = Record<string, any>[]> {
  id: string;
  results: T;
  meta: JsonApiResponse['meta'];
  links: JsonApiResponse['links'];
}
export interface DrupalFragment extends JsonApiResourceWithPath {
  drupal_internal__nid: number;
  drupal_internal__vid: number;
  changed: string;
  created: string;
  title: string;
  default_langcode: boolean;
}
export interface DrupalArea extends JsonApiResourceWithPath {
  drupal_internal__nid: number;
  drupal_internal__vid: number;
  changed: string;
  created: string;
  label: string;
  default_langcode: boolean;
}
