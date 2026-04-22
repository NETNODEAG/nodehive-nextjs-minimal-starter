import type { ComponentData, Config, Data } from '@puckeditor/core';

const ROOT_ZONE = 'root:default-zone';

export type ComponentLocation = {
  component: ComponentData;
  zone: string;
  index: number;
};

/**
 * Walk the Puck data tree (root content + slot fields) to find a component
 * by id, returning its zone and index for use with fine-grained Puck actions
 * (replace, remove). Returns null if the id is not in the tree.
 */
export function findComponentLocation(
  data: Data,
  config: Config,
  id: string
): ComponentLocation | null {
  for (let i = 0; i < data.content.length; i++) {
    const component = data.content[i];
    if (component.props?.id === id) {
      return { component, zone: ROOT_ZONE, index: i };
    }
    const nested = findInComponent(component, id, config);
    if (nested) return nested;
  }
  return null;
}

function findInComponent(
  component: ComponentData,
  id: string,
  config: Config
): ComponentLocation | null {
  const componentConfig = config.components?.[component.type];
  if (!componentConfig) return null;
  const fields = componentConfig.fields || {};
  const parentId = component.props?.id;
  if (!parentId) return null;

  for (const [fieldName, fieldConfig] of Object.entries(fields)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((fieldConfig as any).type !== 'slot') continue;
    const slotValue = (component.props as Record<string, unknown>)?.[fieldName];
    if (!Array.isArray(slotValue)) continue;

    for (let i = 0; i < slotValue.length; i++) {
      const child = slotValue[i] as ComponentData;
      if (child?.props?.id === id) {
        return {
          component: child,
          zone: `${parentId}:${fieldName}`,
          index: i,
        };
      }
      const deeper = findInComponent(child, id, config);
      if (deeper) return deeper;
    }
  }
  return null;
}

/**
 * Returns the length of a zone's content array (to compute an append index
 * for incremental insert actions).
 */
export function getZoneLength(
  data: Data,
  config: Config,
  zone: string
): number {
  if (zone === ROOT_ZONE) return data.content.length;

  const [parentId, slotName] = zone.split(':');
  if (!parentId || !slotName) return 0;

  const walk = (components: ComponentData[]): number | null => {
    for (const c of components) {
      if (c.props?.id === parentId) {
        const slotValue = (c.props as Record<string, unknown>)?.[slotName];
        return Array.isArray(slotValue) ? slotValue.length : 0;
      }
      const componentConfig = config.components?.[c.type];
      if (!componentConfig) continue;
      for (const [fName, fConfig] of Object.entries(
        componentConfig.fields || {}
      )) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((fConfig as any).type !== 'slot') continue;
        const sv = (c.props as Record<string, unknown>)?.[fName];
        if (Array.isArray(sv)) {
          const inner = walk(sv as ComponentData[]);
          if (inner !== null) return inner;
        }
      }
    }
    return null;
  };

  return walk(data.content) ?? 0;
}
