import { redirect } from 'next/navigation';
import { logout } from '@/actions/_auth';
import { getUser } from '@/actions/_user';

export default async function Page() {
  const { user } = await getUser();

  if (!user) {
    redirect('/nodehive/login');
  }

  {/* @ts-ignore */}
  const name = user?.name?.[0]?.value;
  {/* @ts-ignore */}
  const email = user?.mail?.[0]?.value;

  return (
    <section className="space-y-8">
      <h1 className="text-4xl font-bold sm:text-6xl">Account</h1>

      <div className="space-y-4">
        <ul>
          <li>
            <strong>Username:</strong> {name}
          </li>
          <li>
            <strong>Email:</strong> {email}
          </li>
          <li className="mt-8">
            <form action={logout}>
              <button type="submit" className="text-sm font-bold uppercase">
                Logout
              </button>
            </form>
          </li>
        </ul>
      </div>
    </section>
  );
}
