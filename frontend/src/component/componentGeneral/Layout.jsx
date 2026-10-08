import Headers from './Headers.jsx';
import Footer from './Footer.jsx';
import MarqueeModern from './MarqueeModern.jsx';
import { Toaster } from '@/components/ui/sonner';
import WhatsAppButton from '@/component/componentGeneral/WhatsAppButton.jsx';
import Newsletter from '#component/componentGeneral/Newsletter.jsx';
import BottomFooterPromo from '#component/componentGeneral/BottomFooterPromo.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MarqueeModern />
      <Headers />
      <Toaster position="top-right" />
      <main className="flex-grow">{children}</main>
      <WhatsAppButton />
      <BottomFooterPromo />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Layout;
