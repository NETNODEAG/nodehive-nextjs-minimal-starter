import { AuthWrapper, NotLoggedIn } from '@/components/auth/AuthWrapper';
import MenuEditButton from '@/components/nodehive/visual-editor/menu/MenuEditButton';

type MenuWrapperProps = {
  type?: string;
  menuId: string;
  children: React.ReactNode;
};

export default function MenuWrapper({
  type = 'menu',
  menuId,
  children,
}: MenuWrapperProps) {
  return (
    <div data-nodehive-type="menu" className="relative">
      <AuthWrapper>
        <div className="outline-primary-700 rounded-lg hover:outline-2 hover:-outline-offset-2 hover:outline-dashed">
          <MenuEditButton type={type} menuId={menuId} label="Edit menu" />

          {children}
        </div>
      </AuthWrapper>

      <NotLoggedIn>{children}</NotLoggedIn>
    </div>
  );
}
