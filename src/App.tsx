import { useAuth } from './auth';
import LoadingScreen from './components/LoadingScreen';
import LoginGate from './components/LoginGate';
import MemberApp from './MemberApp';

export default function App() {
  const { enabled, loading, user } = useAuth();
  if (loading) return <LoadingScreen show />;
  if (!enabled || !user) return <LoginGate />;
  return <MemberApp user={user} />;
}
