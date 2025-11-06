'use client';

import { LandingNavbar } from '../../components/layout/landing-navbar';
import { Hero, FeatureGrid, PricingCard, Footer } from '@/components/atomic-design/organisms';
import { useTranslations } from '@/context/TranslationContext';

export default function Home() {
  const t = useTranslations();

  // Hero configuration
  const heroProps = {
    badge: t('homepage.hero.badge'),
    title: t('homepage.hero.title'),
    titleHighlight: t('homepage.hero.titleHighlight'),
    subtitle: t('homepage.hero.subtitle'),
    secondaryCTA: {
      text: t('homepage.hero.viewDemo'),
      href: '#demo',
      variant: 'outline' as const,
    },
    features: [
      {
        icon: 'check-circle',
        text: t('homepage.hero.quickInstall'),
      },
      {
        icon: 'check-circle',
        text: t('homepage.hero.freeUpdates'),
      },
    ],
  };

  // Features configuration
  const featuresProps = {
    title: t('homepage.features.title'),
    subtitle: t('homepage.features.subtitle'),
    features: [
      {
        icon: 'shield',
        title: t('homepage.features.auth.title'),
        description: t('homepage.features.auth.description'),
      },
      {
        icon: 'users',
        title: t('homepage.features.admin.title'),
        description: t('homepage.features.admin.description'),
      },
      {
        icon: 'zap',
        title: t('homepage.features.database.title'),
        description: t('homepage.features.database.description'),
      },
      {
        icon: 'palette',
        title: t('homepage.features.ui.title'),
        description: t('homepage.features.ui.description'),
      },
      {
        icon: 'globe',
        title: t('homepage.features.i18n.title'),
        description: t('homepage.features.i18n.description'),
      },
      {
        icon: 'star',
        title: t('homepage.features.production.title'),
        description: t('homepage.features.production.description'),
      },
    ],
    columns: {
      mobile: 1 as const,
      tablet: 2 as const,
      desktop: 3 as const,
    },
  };

  // Pricing configuration
  const pricingProps = {
    badge: t('homepage.pricing.badge'),
    title: t('homepage.pricing.planTitle'),
    price: t('homepage.pricing.price'),
    originalPrice: t('homepage.pricing.originalPrice'),
    discount: t('homepage.pricing.discount'),
    description: t('homepage.pricing.description'),
    features: [
      t('homepage.pricing.features.sourceCode'),
      t('homepage.pricing.features.nextjs'),
      t('homepage.pricing.features.nextauth'),
      t('homepage.pricing.features.database'),
      t('homepage.pricing.features.ui'),
      t('homepage.pricing.features.adminPanel'),
      t('homepage.pricing.features.userManagement'),
      t('homepage.pricing.features.email'),
      t('homepage.pricing.features.i18n'),
      t('homepage.pricing.features.documentation'),
    ],
    ctaText: t('homepage.pricing.buyNow'),
    ctaHref: '#purchase',
    guarantee: t('homepage.pricing.guarantee'),
    featuresColumns: 2 as const,
  };

  // Footer configuration
  const footerProps = {
    brand: {
      name: t('homepage.footer.title'),
      description: t('homepage.footer.description'),
    },
    sections: [
      {
        title: t('homepage.footer.product'),
        links: [
          { text: t('homepage.footer.features'), href: '#features' },
          { text: t('homepage.footer.pricing'), href: '#pricing' },
          { text: t('homepage.footer.demo'), href: '#demo' },
        ],
      },
      {
        title: t('homepage.footer.support'),
        links: [
          { text: t('homepage.footer.documentation'), href: '#docs' },
          { text: t('homepage.footer.contact'), href: '#contact' },
          { text: t('homepage.footer.faq'), href: '#faq' },
        ],
      },
      {
        title: t('homepage.footer.legal'),
        links: [
          { text: t('homepage.footer.privacy'), href: '#privacy' },
          { text: t('homepage.footer.terms'), href: '#terms' },
          { text: t('homepage.footer.license'), href: '#license' },
        ],
      },
    ],
    copyright: t('homepage.footer.copyright'),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <Hero {...heroProps} />
      <FeatureGrid {...featuresProps} />
      <PricingCard {...pricingProps} />
      <Footer {...footerProps} />
    </div>
  );
}
