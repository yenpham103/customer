/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */

"use client"

import { Frame, Layout, LegacyCard, Loading, Navigation, Scrollable, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer, TopBar } from '@shopify/polaris';
import { ChatIcon, ExitIcon, HomeIcon, PersonFilledIcon, PersonIcon, PersonLockIcon, StoreIcon } from '@shopify/polaris-icons';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function AppNavigation({ children, session }: { children: React.ReactNode, session: any }) {
  "use client"
  const [isLoading, _] = React.useState(false);
  const [userMenuActive, setUserMenuActive] = React.useState(false);
  const skipToContentRef = React.useRef<HTMLAnchorElement>(null);
  const [mobileNavigationActive, setMobileNavigationActive] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );

  const toggleMobileNavigationActive = React.useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );

  const toggleNavigate = React.useCallback(
    (url: string) => {
      if (pathname !== url) {
        router.push(url);
        if (skipToContentRef.current) {
          skipToContentRef.current.focus();
        }
      }
    }
    , [pathname, router]);

  const toggleUserMenuActive = React.useCallback(
    () => setUserMenuActive((userMenuActive: any) => !userMenuActive),
    [],
  );

  const actualPageMarkup = (
    <>
      <div className="bss-main-content">
        {children}
      </div>
      <footer className="bss-footer">
        <div className="bss-footer-container">
          <p className="bss-footer-copyright">© {new Date().getFullYear()} SBC Team B Customer. All rights reserved.</p>
          <p className="bss-footer-powered">
            Powered by <Link href="https://bsscommerce.com" target="_blank">BSS Commerce</Link>
          </p>
        </div>
      </footer>
    </>
  );

  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

  const navigationMarkup = typeof window !== undefined ? (
    <Navigation location="/">
      <Scrollable style={{ flex: 1 }}>
        <Navigation.Section
          items={[
            {
              label: 'Dashboard',
              icon: HomeIcon,
              selected: pathname === '/dashboard',
              onClick: () => toggleNavigate('/dashboard'),
            },
          ]}
        />
        <Navigation.Section
          separator
          title='Crisp'
          items={[
            {
              label: 'Operators',
              icon: PersonIcon,
              selected: pathname === '/crisp/operators',
              onClick: () => toggleNavigate('/crisp/operators'),
            },
            {
              label: 'Conversations',
              icon: ChatIcon,
              selected: pathname === '/crisp/conversations',
              onClick: () => toggleNavigate('/crisp/conversations'),
            },
          ]}
        />
        <Navigation.Section
          separator
          title='Store data'
          items={[
            {
              label: 'Store',
              icon: StoreIcon,
              selected: pathname === '/store-data/store',
              onClick: () => toggleNavigate('/store-data/store'),
            },
            {
              label: 'Ignored nicknames',
              icon: PersonLockIcon,
              selected: pathname === '/store-data/ignore',
              onClick: () => toggleNavigate('/store-data/ignore'),
            },
          ]}
        />

      </Scrollable>
      <Navigation.Section
        separator
        title="Admin"
        items={[
          {
            label: 'User Administration',
            icon: PersonFilledIcon,
            onClick: () => toggleNavigate('/admin/user-administration'),
            selected: pathname === '/admin/user-administration',
          },
        ]}
        rollup={{
          after: 1,
          view: 'popup',
          hide: 'hide',
          activePath: '/',
        }}
      />
    </Navigation>
  ) : <></>;

  const loadingMarkup = isLoading ? <Loading /> : null;

  const userMenuActions = [
    {
      items: [{ icon: ExitIcon, content: 'Sign out', onAction: () => signOut({ callbackUrl: "/" }) }],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={session?.user?.name}
      detail={session?.user?.email}
      initials="D"
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
      customWidth='fit-content'
      avatar={session?.user?.image ? session.user.image : undefined}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
    >
      {loadingMarkup}
      <>
        {skipToContentTarget}
        {pageMarkup}
      </>
    </Frame>
  );
}