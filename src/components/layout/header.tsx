import HeaderCallToAction from './header-call-to-action';
import HeaderLogo from './header-logo';
import HeaderNavigation from './header-navigation';

export default async function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-8 px-4 py-4 md:px-8">
        <HeaderLogo />

        <div className="flex flex-1 items-center justify-end gap-8 md:justify-between">
          <div className="order-2 md:order-none">
            <HeaderNavigation menuId="green-bowl-lille-mainnavigation" />
          </div>

          <HeaderCallToAction />
        </div>
      </div>
    </header>
  );
}
