import { AuthWrapper } from '@/nodehive/components/auth/auth-wrapper';
import Logout from '@/nodehive/components/smart-actions/logout';
import OpenVisualEditor from '@/nodehive/components/smart-actions/open-visual-editor';
import RefreshPage from '@/nodehive/components/smart-actions/refresh-page';
import UserProfile from '@/nodehive/components/smart-actions/user-profile';
import Tooltip from '@/ui/netnode/tooltip';

export default function SmartActionsButton() {
  return (
    <AuthWrapper>
      <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2">
        <div className="rounded-full bg-neutral-900 p-2 text-sm font-bold text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)] shadow-white/20 backdrop-blur-2xl">
          <ul className="flex items-center gap-2">
            <li>
              <Tooltip label="User">
                <UserProfile />
              </Tooltip>
            </li>
            <li>
              <Tooltip label="Visual Editor">
                <OpenVisualEditor />
              </Tooltip>
            </li>
            <li>
              <Tooltip label="Refresh">
                <RefreshPage />
              </Tooltip>
            </li>
            <li>
              <Tooltip label="Logout">
                <Logout />
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </AuthWrapper>
  );
}
