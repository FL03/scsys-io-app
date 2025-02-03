/*
  Appellation: shift-screen <module>
  Contrib: @FL03
*/
'use client';
// imports
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

export const ShiftsDisplay: React.FC<import('@/types').TitledProps> = () => {
  const Dashboard = dynamic(async () => await import('./shift-dashboard'), {
    ssr: false,
  });
  const TableView = dynamic(
    async () => await import('../widgets/shift-table'),
    {
      ssr: false,
    }
  );
  const searchParams = useSearchParams();

  const view = searchParams.get('view') ?? 'dashboard';

  switch (view) {
    case 'table': // case 'table':
      return <TableView />;
    default:
      return (
        <Dashboard
          className="h-full"
          description="The dashboard for user's to view and manage their shifts."
          title="Shifts"
        />
      );
  }
};

export default ShiftsDisplay;