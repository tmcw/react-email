/* eslint-disable @typescript-eslint/no-unsafe-member-access -- TODO: fix */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- TODO: fix */
import { promises as fs } from 'node:fs';
import { dirname, join as pathJoin } from 'node:path';
import { render } from '@react-email/render';
import { CONTENT_DIR, getEmails } from '../../../utils/get-emails';
import Preview from './preview';

export const dynamicParams = true;

export async function generateStaticParams() {
  const { emails } = await getEmails();

  const paths = emails.map((email) => {
    return { slug: email };
  });

  return paths;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { emails, filenames } = await getEmails();
  const template = filenames.filter((email) => {
    const [fileName] = email.split('.');
    return params.slug === fileName;
  });

  const Email = (await import(`../../../../emails/${params.slug}`)).default;
  const previewProps = Email.PreviewProps || {};
  const markup = render(<Email {...previewProps} />, { pretty: true });
  const plainText = render(<Email {...previewProps} />, { plainText: true });
  const basePath = pathJoin(process.cwd(), CONTENT_DIR);
  const path = pathJoin(basePath, template[0]);

  // the file is actually just re-exporting the default export of the original file. We need to resolve this first
  const exportTemplateFile: string = await fs.readFile(path, {
    encoding: 'utf-8',
  });
  const packageImport = /import Mail from '(?<package>.+)';/.exec(
    exportTemplateFile,
  );
  const importPath = packageImport ? packageImport[1] : '';
  const originalFilePath = pathJoin(dirname(path), importPath);

  const reactMarkup: string = await fs.readFile(originalFilePath, {
    encoding: 'utf-8',
  });

  return (
    <Preview
      markup={markup}
      navItems={emails}
      plainText={plainText}
      reactMarkup={reactMarkup}
      slug={params.slug}
    />
  );
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} — React Email` };
}
