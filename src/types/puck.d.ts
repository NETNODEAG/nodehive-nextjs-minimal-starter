import '@puckeditor/core';

declare module '@puckeditor/core' {
  interface ComponentConfigExtensions {
    ai?: {
      description?: string;
      instructions?: string;
      exclude?: boolean;
    };
  }

  interface FieldMetadata {
    ai?: {
      instructions?: string;
      bind?: string;
    };
  }
}
