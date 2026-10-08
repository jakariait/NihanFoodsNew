import GeneralInfoStore from '../../store/GeneralInfoStore.js';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import SocialMedia from './SocialMedia.jsx';
import ImageComponent from './ImageComponent.jsx';
import Skeleton from 'react-loading-skeleton';

const QUICK_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact-us' },
  { label: 'Terms of Services', to: '/termofservice' },
  { label: 'Privacy Policy', to: '/privacypolicy' },
  { label: 'Refund Policy', to: '/refundpolicy' },
  { label: 'Shipping Policy', to: '/shippinpolicy' },
  { label: 'FAQ', to: '/faqs' },
  { label: 'Track Your Order', to: '/track-order' },
];

const FooterHeading = ({ children }) => (
  <h2 className="mb-3 font-semibold">{children}</h2>
);

const AboutSection = ({ generalInfo, variant }) => (
  <div className={variant === 'mobile' ? 'px-4' : 'col-span-6'}>
    <Link to="/" aria-label={`${generalInfo?.CompanyName || 'Home'}`}>
      <ImageComponent
        imageName={generalInfo?.PrimaryLogo}
        altName={generalInfo?.CompanyName}
        className="h-9 w-auto object-contain"
        skeletonHeight="36"
      />
    </Link>
    <p className="mt-4 max-w-xl">{generalInfo?.ShortDescription}</p>
    <h2 className="mb-3 mt-3">Follow Us</h2>
    <SocialMedia />
  </div>
);

const QuickLinksSection = ({ variant }) => (
  <div className={variant === 'mobile' ? '' : 'col-span-3'}>
    <FooterHeading>Quick Links</FooterHeading>
    <ul className={variant === 'mobile' ? 'space-y-2' : 'text-white'}>
      {QUICK_LINKS.map(({ label, to }) => (
        <li key={to} className="hover:text-gray-300">
          <Link to={to}>{label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const ContactSection = ({ generalInfo, variant }) => {
  const phoneNumbers = generalInfo?.PhoneNumber?.filter(Boolean) || [];
  const emails = generalInfo?.CompanyEmail?.filter(Boolean) || [];
  const address = generalInfo?.CompanyAddress || '';

  return (
    <div className={variant === 'mobile' ? '' : 'col-span-3'}>
      <FooterHeading>Contact Us</FooterHeading>
      <ul className="space-y-3">
        {phoneNumbers.map((number) => (
          <li key={number} className="flex items-start gap-2">
            <Phone className="size-4 mt-1 shrink-0" />
            <a href={`tel:${number}`} className="hover:text-gray-300">
              {number}
            </a>
          </li>
        ))}
        {emails.map((email) => (
          <li key={email} className="flex items-start gap-2">
            <Mail className="size-4 mt-1 shrink-0" />
            <a
              href={`mailto:${email}`}
              className="hover:text-gray-300 break-all"
            >
              {email}
            </a>
          </li>
        ))}
        {address && (
          <li className="flex items-start gap-2">
            <MapPin className="size-4 mt-1 shrink-0" />
            <span className="break-words">{address}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

const FooterBottom = ({ generalInfo }) => (
  <div
    className={
      'text-center pb-5 pt-5 flex flex-col md:flex-row items-center justify-center gap-3'
    }
  >
    <p>
      © {new Date().getFullYear()} {generalInfo?.CompanyName}. All Rights
      Reserved.
    </p>
    <p>
      Design and Developed by{' '}
      <a
        href="https://www.digiweb.digital/"
        className={'text-green-500 hover:underline'}
      >
        DigiWeb
      </a>
    </p>
  </div>
);

const FooterError = () => (
  <div className="primaryTextColor container md:mx-auto text-center p-3">
    <h1 className="p-20">Something went wrong! Please try again later.</h1>
  </div>
);

const FooterSkeleton = () => (
  <>
    <div
      className={
        'grid grid-cols-2 md:grid-cols-4 gap-3 xl:container xl:mx-auto p-3'
      }
    >
      <Skeleton height={200} width={'100%'} />
      <Skeleton height={200} width={'100%'} />
      <Skeleton height={200} width={'100%'} />
      <Skeleton height={200} width={'100%'} />
    </div>
    <Skeleton height={40} width={'100%'} />
  </>
);

const Footer = () => {
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();

  if (GeneralInfoListError) {
    return <FooterError />;
  }

  if (GeneralInfoListLoading) {
    return <FooterSkeleton />;
  }

  return (
    <div className={'secondaryBgColor accentTextColor'}>
      {/*Mobile Footer*/}
      <div className={'lg:hidden px-0 py-3'}>
        <AboutSection generalInfo={GeneralInfoList} variant="mobile" />

        <div className="grid grid-cols-2 gap-6 px-4 mt-6">
          <QuickLinksSection variant="mobile" />
          <ContactSection generalInfo={GeneralInfoList} variant="mobile" />
        </div>
      </div>

      {/*Desktop Footer*/}
      <div
        className={
          'xl:container xl:mx-auto lg:grid grid-cols-1 lg:grid-cols-12 gap-10 justify-between py-10 px-6 hidden'
        }
      >
        <AboutSection generalInfo={GeneralInfoList} variant="desktop" />
        <QuickLinksSection variant="desktop" />
        <ContactSection generalInfo={GeneralInfoList} variant="desktop" />
      </div>

      <FooterBottom generalInfo={GeneralInfoList} />
    </div>
  );
};

export default Footer;
