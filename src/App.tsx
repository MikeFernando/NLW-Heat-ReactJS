import { SendeMessageForm } from './components/SendMessageForm';
import { MessageList } from './components/MessageList';
import { LoginBox } from './components/LoginBox';

import { useAuth } from './contexts/Auth';

import styles from './App.module.scss';

export function App() {
  const { user } = useAuth();

  return (
    <main className=
      {`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      {!!user ? <SendeMessageForm /> : <LoginBox />}
    </main>
  )
}