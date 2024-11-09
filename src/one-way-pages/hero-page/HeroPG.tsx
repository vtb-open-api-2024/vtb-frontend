import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface iHeroPG {
  waypoint: string | undefined;

  spareWaypoint: string | undefined;
}

export const HeroPG = ({ waypoint = '/' }: iHeroPG) => {
  const moveTo = useNavigate();

  return (
    <div className={` hero-page`}>
      <div className={`page one-way-page ${styles.hero_page_bg}`}>
      <h1 className={styles.header}>
        <span>Получите</span> доступ к&nbsp;криптовалютам
      </h1>
      <p className={styles.paragraph}>
        Перемещайте BTC, ETH, USDT и более 30 других токенов между вашим кошельком и <span>ВТБ</span>
      </p>
      <button onClick={() => moveTo(waypoint)} className={'button ' + styles.herobutton}>
        Создать кошелек
      </button>
      <div
        onClick={() => {
          moveTo(waypoint);
        }}
        className={styles.bottomText}
      >
        Есть кошелек? Войти
      </div>
      </div>
    </div>
  );
};
