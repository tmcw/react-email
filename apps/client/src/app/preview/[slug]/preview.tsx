'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { CodeContainer } from '../../../components/code-container';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';

export default function Preview({
  navItems,
  slug,
  markup,
  reactMarkup,
  plainText,
}: {
  navItems: string[];
  slug: string;
  markup: string;
  reactMarkup: string;
  plainText: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = React.useState('desktop');
  const [activeLang, setActiveLang] = React.useState('jsx');

  React.useEffect(() => {
    const view = searchParams.get('view');
    const lang = searchParams.get('lang');

    if (view === 'source' || view === 'desktop') {
      setActiveView(view);
    }

    if (lang === 'jsx' || lang === 'markup' || lang === 'markdown') {
      setActiveLang(lang);
    }
  }, [searchParams]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    router.push(`${pathname}?view=${view}`);
  };

  const handleLangChange = (lang: string) => {
    setActiveLang(lang);
    router.push(`${pathname}?view=source&lang=${lang}`);
  };

  return (
    <Shell
      activeView={activeView}
      markup={markup}
      navItems={navItems}
      setActiveView={handleViewChange}
      title={slug}
    >
      {activeView === 'desktop' ? (
        <iframe
          className="w-full h-[calc(100vh_-_140px)]"
          srcDoc={markup}
          title="desktop-preview"
        />
      ) : (
        <div className="flex gap-6 mx-auto p-6 max-w-3xl">
          <Tooltip.Provider>
            <CodeContainer
              activeLang={activeLang}
              markups={[
                { language: 'jsx', content: reactMarkup },
                { language: 'markup', content: markup },
                { language: 'markdown', content: plainText },
              ]}
              setActiveLang={handleLangChange}
            />
          </Tooltip.Provider>
        </div>
      )}
    </Shell>
  );
}
