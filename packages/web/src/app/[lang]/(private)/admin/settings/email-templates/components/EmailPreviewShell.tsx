import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Tailwind,
  Hr,
  Link,
  Img,
} from '@react-email/components';

interface EmailPreviewShellProps {
  title: string;
  children: React.ReactNode;
  previewText?: string;
  locale?: string;
}

export function EmailPreviewShell({
  title,
  children,
  previewText,
  locale = 'es',
}: EmailPreviewShellProps) {
  return (
    <Html lang={locale}>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#007bff', // Example brand color, should be configurable
              },
            },
          },
        }}
      >
        <Body className="bg-zinc-100 font-sans my-auto mx-auto px-2 py-10">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[600px] bg-white">
            <Section className="mt-[32px]">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Img
                  src="/logo-light.png"
                  alt="Alianza Consulting Corp"
                  width={200}
                  height="auto"
                  style={{ margin: '0 auto' }}
                />
              </div>
            </Section>

            <Section className="text-zinc-700">{children}</Section>

            <Hr className="border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Section>
              <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                © {new Date().getFullYear()} Alianza Consulting Corp. All rights
                reserved.
              </Text>
              <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                <Link href="#" className="text-zinc-500 underline">
                  Privacy Policy
                </Link>{' '}
                •{' '}
                <Link href="#" className="text-zinc-500 underline">
                  Terms of Service
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
