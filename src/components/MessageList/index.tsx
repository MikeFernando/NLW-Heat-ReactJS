import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import logoImg from '../../assets/logo.svg';
import api from '../../service/api';

import styles from './styles.module.scss';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

let messagesQueue: Message[] = [];

const socket = io('http://localhost:3333');
socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [ messages, setMessages ] = useState<Message[]>([]);

  // Verifica se na fila de mensagens tem mensagem
  // Sobrepor array de mensagens com a 1° mensagem da messagesQueue [0]
  // Depois pegar as mensagens que já existiam no estado nas posiçôes [0] e [1]
  useEffect(() => {
    if (messagesQueue.length > 0) {
      setInterval(() => {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean))
      }, 3000);
    }
  }, []);

  // Busca últimas 3 mensagens e salva no estado de messages
  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messagesListWrapper}>
      <img src={logoImg} alt="Do while 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => (
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>{message.text} </p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img 
                  src={message.user.avatar_url} 
                  alt={message.user.name}
                />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}