import { Locale } from '@/nodehive/i18n-config';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import LogoutForm from '@/components/nodehive/smart-actions/LogoutForm';
import OpenVisualEditor from '@/components/nodehive/smart-actions/OpenVisualEditor';
import RefreshPage from '@/components/nodehive/smart-actions/RefreshPage';
import UserProfile from '@/components/nodehive/smart-actions/UserProfile';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/atoms/tooltip/tooltip';

export default function SmartActionsButton({ lang }: { lang: Locale }) {
  return (
    <AuthWrapper>
      <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2">
        <div className="rounded-full bg-neutral-900 p-2 text-sm font-bold text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)] shadow-white/20 backdrop-blur-2xl">
          <ul className="flex items-center gap-2">
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <UserProfile />
                </TooltipTrigger>
                <TooltipContent>User Profile</TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <OpenVisualEditor />
                </TooltipTrigger>
                <TooltipContent>Visual Editor</TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <RefreshPage lang={lang} />
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger>
                  <LogoutForm />
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </AuthWrapper>
  );
}
