import {
  AuthWrapper,
  NotLoggedIn,
} from '@/nodehive/components/auth/auth-wrapper';

import MenuEditButton from './menu-edit-button';

export default function MenuWrapper({
  type = 'menu',
  menuId,
  children,
  negative = false,
}) {
  return (
    <div data-nodehive-type="menu" className="relative">
      <AuthWrapper>
        <div className="rounded-lg outline-primary-700 hover:outline-dashed hover:outline-2 hover:-outline-offset-2">
          <MenuEditButton type={type} menuId={menuId} label="Edit menu" />

          {children}
        </div>
      </AuthWrapper>

      <NotLoggedIn>{children}</NotLoggedIn>
    </div>
  );
}
