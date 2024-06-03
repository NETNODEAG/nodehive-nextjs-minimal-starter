import { Logo } from '@/lib/icons';
import FooterArea from './footer-area';
import SocialMediaNavigation from './footer-social-media-navigation';

export default async function Footer() {
  return (
    <footer>
      <div className="bg-black text-white">
        <div className="container mx-auto space-y-12 px-4 py-24 md:px-8">
          <div className="flex items-center justify-between">
            <Logo className="h-[29px] max-w-[120px]" />

            <SocialMediaNavigation menuId="social-media" />
          </div>
        </div>
      </div>

      <div className="bg-[#DCEBE9]">
        <div className="container mx-auto space-y-12 px-4 py-4 md:px-8">
          <FooterArea />
        </div>
      </div>
    </footer>
  );
}
