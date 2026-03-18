import type { Dictionary } from '@/dictionaries';
import { DictionaryProvider } from '@/providers/dictionary-provider';
import { PuckEditorProvider } from '@/providers/puck-editor-provider';
import { QueryProvider } from '@/providers/query-provider';

type AppProviderProps = {
  dictionary: Dictionary;
  children: React.ReactNode;
};

export default function AppProvider({
  children,
  dictionary,
}: AppProviderProps) {
  return (
    <QueryProvider>
      <PuckEditorProvider>
        <DictionaryProvider dictionary={dictionary}>
          {children}
        </DictionaryProvider>
      </PuckEditorProvider>
    </QueryProvider>
  );
}
