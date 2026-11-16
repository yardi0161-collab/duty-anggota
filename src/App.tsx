import { useAuth } from './auth';
import LoadingCard from './components/LoadingCard';
import type { Status } from './components/LoadingCard';
import LoginGate from './components/LoginGate';
import MemberApp from './MemberApp';

const CHECKING: Status = { kind: 'loading', text: 'Memeriksa sesi...' };

export default function App() {
  const { enabled, loading, user } = useAuth();
  if (loading) return <LoadingCard status={CHECKING} />;
  if (!enabled || !user) return <LoginGate />;
  return <MemberApp user={user} />;
}
