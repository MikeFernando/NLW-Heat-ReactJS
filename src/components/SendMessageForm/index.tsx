import { FormEvent, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';

import { useAuth } from '../../contexts/Auth';
import api from '../../service/api';

import styles from './styles.module.scss';

export function SendeMessageForm() {
  const { user, signOut } = useAuth();

  const [ message, setMessage ] = useState('');

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('/messages', { message });

    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img 
            src={user?.avatar_url} 
            alt={user?.name}
          />
        </div>

        <strong className={styles.userName}>
          {user?.name}
        </strong>

        <span className={styles.userGithub}>
          {<VscGithubInverted />}
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          value={message}
          onChange={({ target }) => setMessage(target.value)}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}