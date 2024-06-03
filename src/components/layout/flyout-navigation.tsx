'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ChevronDownIcon, CloseIcon, HamburguerIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

export default function FlyoutNavigation({ menu }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (itemId: string) => {
    // Only toggle, don't navigate or close flyout
    setOpenSubMenu((prevOpenSubMenu) => ({
      ...prevOpenSubMenu,
      [itemId]: !prevOpenSubMenu[itemId],
    }));
  };

  const closeFlyout = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const main = document.querySelector('main');

    if (isOpen) {
      main.toggleAttribute('inert');
      document.body.classList.add('overflow-hidden');
    } else {
      main.removeAttribute('inert');
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  return (
    <>
      <button
        className="text-inherit md:hidden"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Open the main menu"
      >
        <HamburguerIcon />
      </button>

      <div
        className={cn(
          isOpen
            ? 'visible bottom-0 overflow-y-auto opacity-100'
            : 'invisible overflow-hidden opacity-0',
          'fixed left-0 right-0 top-0 z-40 bg-[#DCEBE9] text-black lg:hidden'
        )}
      >
        <div className="flex flex-col gap-12 p-5">
          <div className="flex justify-end">
            <button
              onClick={closeFlyout}
              className="h-[24px] w-[24px]"
              aria-expanded={isOpen}
              aria-label="Close the main menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav>
            <ul>
              {Object.values(menu)?.map((item: any) => (
                <li
                  key={item?.id}
                  className="border-t border-black py-4 last:border-b"
                >
                  {item.subMenu.length > 0 ? (
                    <>
                      <button
                        className="flex w-full items-center justify-between text-left text-3xl font-medium"
                        onClick={() => toggleSubMenu(item.id)}
                      >
                        {item?.title}

                        <ChevronDownIcon
                          className={cn(
                            openSubMenu[item.id] ? 'rotate-180 transform' : '',
                            'ml-2 inline-block h-6 w-6 transition-transform duration-200 ease-in-out'
                          )}
                        />
                      </button>

                      {openSubMenu[item.id] && (
                        <ul className="mt-6 flex flex-col gap-3">
                          {item.subMenu.map((subItem: any) => (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.url}
                                onClick={closeFlyout}
                                className="text-md block font-medium"
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item?.url}
                      onClick={closeFlyout}
                      className="block text-3xl font-medium"
                    >
                      {item?.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
