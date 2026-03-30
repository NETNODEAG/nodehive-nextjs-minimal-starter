import { ExternalLink } from 'lucide-react';

import { Locale } from '@/config/i18n-config';
import { cn } from '@/lib/utils';
import { AuthWrapper } from '@/components/nodehive/auth-wrapper';
import LogoutForm from '@/components/nodehive/smart-actions/logout-form';
import OpenPuckEditor from '@/components/nodehive/smart-actions/open-puck-editor';
import RefreshPage from '@/components/nodehive/smart-actions/refresh-page';
import UserProfile from '@/components/nodehive/smart-actions/user-profile';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/atoms/tooltip/tooltip';

interface SmartActionsButtonProps {
  lang: Locale;
  nodeId?: number;
}

export default function SmartActionsButton({
  lang,
  nodeId,
}: SmartActionsButtonProps) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.replace(
    /\/$/,
    ''
  );
  const backendEditUrl =
    backendBaseUrl && nodeId
      ? `${backendBaseUrl}/${lang}/node/${nodeId}/edit`
      : null;

  return (
    <AuthWrapper>
      <div className="fixed bottom-10 left-1/2 z-40 -translate-x-1/2">
        <div className="rounded-full bg-neutral-900 p-2 text-sm font-bold text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)] shadow-white/20 backdrop-blur-2xl">
          <ul className="flex items-center gap-2">
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <UserProfile />
                </TooltipTrigger>
                <TooltipContent className="text-white">
                  User Profile
                </TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <OpenPuckEditor />
                </TooltipTrigger>
                <TooltipContent className="text-white">Edit</TooltipContent>
              </Tooltip>
            </li>
            {backendEditUrl && (
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={backendEditUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-neutral-700'
                      )}
                    >
                      <span className="sr-only">Backend Edit</span>
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-white">
                    Backend Edit
                  </TooltipContent>
                </Tooltip>
              </li>
            )}
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <RefreshPage lang={lang} />
                </TooltipTrigger>
                <TooltipContent className="text-white">Refresh</TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <LogoutForm />
                </TooltipTrigger>
                <TooltipContent className="text-white">Logout</TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </AuthWrapper>
  );
}
