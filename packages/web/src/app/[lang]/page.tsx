'use client';

import { LandingNavbar } from '../../components/layout/landing-navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  Palette,
  Code,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import TailwindGrid from '@/components/grid/TailwindGrid';
import { useTranslations } from '@/context/TranslationContext';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />

      {/* Hero Section */}
      <TailwindGrid
        maxWidth="xl"
        padding="md"
        className="py-16 sm:py-24 lg:py-32"
      >
        <div className="col-span-4 lg:col-span-6 space-y-6">
          <Badge className="w-fit">{t('homepage.hero.badge')}</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t('homepage.hero.title')}
            <span className="text-primary">
              {t('homepage.hero.titleHighlight')}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground lg:text-2xl">
            {t('homepage.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="#demo">{t('homepage.hero.viewDemo')}</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('homepage.hero.quickInstall')}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('homepage.hero.freeUpdates')}</span>
            </div>
          </div>
        </div>
        <div className="col-span-4 lg:col-span-6 relative">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {t('homepage.hero.dashboardScreenshot')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('homepage.hero.productPlaceholder')}
              </p>
            </div>
          </div>
        </div>
      </TailwindGrid>


      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-secondary/10">
        <TailwindGrid maxWidth="xl" padding="md">
          <div className="col-span-4 md:col-span-8 lg:col-span-12 text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-4">
              {t('homepage.features.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('homepage.features.subtitle')}
            </p>
          </div>

          <Card className="col-span-4 md:col-span-4 lg:col-span-4 border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('homepage.features.auth.title')}</CardTitle>
              <CardDescription>
                {t('homepage.features.auth.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="col-span-4 md:col-span-4 lg:col-span-4 border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('homepage.features.admin.title')}</CardTitle>
              <CardDescription>
                {t('homepage.features.admin.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="col-span-4 md:col-span-4 lg:col-span-4 border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('homepage.features.database.title')}</CardTitle>
              <CardDescription>
                {t('homepage.features.database.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="col-span-4 md:col-span-4 lg:col-span-4 border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Palette className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('homepage.features.ui.title')}</CardTitle>
              <CardDescription>
                {t('homepage.features.ui.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="col-span-4 md:col-span-4 lg:col-span-4 border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Globe className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('homepage.features.i18n.title')}</CardTitle>
              <CardDescription>
                {t('homepage.features.i18n.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="col-span-4 md:col-span-4 lg:col-span-4 border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('homepage.features.production.title')}</CardTitle>
              <CardDescription>
                {t('homepage.features.production.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </TailwindGrid>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24">
        <TailwindGrid maxWidth="lg" padding="md">
          <div className="col-span-4 md:col-span-8 lg:col-span-12 text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-4">
              {t('homepage.pricing.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('homepage.pricing.subtitle')}
            </p>
          </div>

          <Card className="col-span-4 md:col-span-8 lg:col-span-12 relative border-2 border-primary">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                {t('homepage.pricing.badge')}
              </Badge>
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl">
                {t('homepage.pricing.planTitle')}
              </CardTitle>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-4xl font-bold">
                  {t('homepage.pricing.price')}
                </span>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground line-through">
                    {t('homepage.pricing.originalPrice')}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {t('homepage.pricing.discount')}
                  </div>
                </div>
              </div>
              <CardDescription className="text-lg mt-2">
                {t('homepage.pricing.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.sourceCode')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.nextjs')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.nextauth')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.database')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.ui')}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.adminPanel')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.userManagement')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.email')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.i18n')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{t('homepage.pricing.features.documentation')}</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Button size="lg" className="w-full text-lg py-6" asChild>
                  <Link href="#purchase">{t('homepage.pricing.buyNow')}</Link>
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  {t('homepage.pricing.guarantee')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TailwindGrid>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    A
                  </span>
                </div>
                <span className="font-bold text-xl">
                  {t('homepage.footer.title')}
                </span>
              </div>
              <p className="text-muted-foreground">
                {t('homepage.footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                {t('homepage.footer.product')}
              </h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="#features"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.features')}
                </Link>
                <Link
                  href="#pricing"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.pricing')}
                </Link>
                <Link
                  href="#demo"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.demo')}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                {t('homepage.footer.support')}
              </h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="#docs"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.documentation')}
                </Link>
                <Link
                  href="#contact"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.contact')}
                </Link>
                <Link
                  href="#faq"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.faq')}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                {t('homepage.footer.legal')}
              </h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="#privacy"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.privacy')}
                </Link>
                <Link
                  href="#terms"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.terms')}
                </Link>
                <Link
                  href="#license"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {t('homepage.footer.license')}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>{t('homepage.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
