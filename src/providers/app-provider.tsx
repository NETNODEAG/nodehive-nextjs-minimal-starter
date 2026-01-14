import type { Dictionary } from '@/dictionaries';
import { DictionaryProvider } from '@/providers/dictionary-provider';
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
      <DictionaryProvider dictionary={dictionary}>
        {children}
      </DictionaryProvider>
    </QueryProvider>
  );
}
