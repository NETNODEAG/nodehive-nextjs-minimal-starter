import { ComponentData, Config, walkTree } from '@puckeditor/core';
import { v4 as uuidv4 } from 'uuid';

export const generateId = (type?: string | number) => {
  return type ? `${type}-${uuidv4()}` : uuidv4();
};

export const generateTemplateIds = (
  template: ComponentData[],
  config: Config
) => {
  const data = {
    root: { props: {} },
    content: template,
    zones: {},
  };

  const { content } = walkTree(data, config, (content) =>
    content.map((component) => ({
      ...component,
      props: {
        ...component.props,
        id: generateId(component.type),
      },
    }))
  );

  return content;
};
