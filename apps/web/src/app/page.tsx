import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TOKEN_COOKIE } from '@/lib/auth';

/** Entry point — route to the dashboard when authenticated, else to login. */
export default function Home() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  redirect(token ? '/dashboard' : '/login');
}
