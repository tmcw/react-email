import { getEmails } from '../utils/get-emails';
import Home from './home';

export default async function Index() {
  const { emails } = await getEmails();
  return <Home navItems={emails} />;
}
