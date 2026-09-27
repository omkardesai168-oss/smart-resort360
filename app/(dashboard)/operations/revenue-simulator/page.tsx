import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MANAGER_ROLES } from '@/lib/digital-twin/inventory';
import RevenueSimulatorPage from '@/components/dashboard/revenue-simulator';
export default async function Page() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !MANAGER_ROLES.includes(user.role)) redirect('/guests/concierge');
  return <RevenueSimulatorPage />;
}
