import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { Card, Currency, CurrencyEnum } from '../../types';
import { useEffect, useRef, useState } from 'react';

interface iBuyCryptoPage {
  waypoint?: string;
  spareWaypoint?: string;
}

export const BuyCryptoPage = ({ waypoint = '/', spareWaypoint = '/' }: iBuyCryptoPage) => {
  const moveTo = useNavigate();
  const [CardcurrentIndex, setCardCurrentIndex] = useState(0);
  const [CurcurrentIndex, setCurCurrentIndex] = useState(0);
  const [currencyAmmount, setCurrencyAmmount] = useState(0);
  const [rubAmmount, setRubAmount] = useState(0);
  const [isOk, setIsOk] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const cards: Card[] = [
    {
      id: 'dummy',
      cardHolderName: undefined,
      CardName: undefined,
      cardNumber: '2002200220022002',
      cardExpiryDate: undefined,
      balance: 10000,
    },
    {
      id: 'dummy2',
      cardHolderName: undefined,
      CardName: undefined,
      cardNumber: '200220022002222',
      cardExpiryDate: undefined,
      balance: 10500,
    },
  ]; // fetch cards from API or local storage

  const currencies: Currency[] = [
    { currency: CurrencyEnum.BTC, cource: 0.000015 },
    { currency: CurrencyEnum.ETC, cource: 0.0055 },
  ]; // fetch currencies from API or local storage

  //   slider for cards handlers
  const cardTohandleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const cardTohandleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const cardTohandleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 150) {
      // Swipe left
      setCardCurrentIndex((prevIndex) => (prevIndex < cards.length - 1 ? prevIndex + 1 : 0));
    } else if (touchEndX.current - touchStartX.current > 150) {
      // Swipe right
      setCardCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : cards.length - 1));
    }
  };
  //   slider for currencies handlers
  const CurTohandleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const CurTohandleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const CurTohandleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 150) {
      // Swipe left
      setCurCurrentIndex((prevIndex) => (prevIndex < currencies.length - 1 ? prevIndex + 1 : 0));
    } else if (touchEndX.current - touchStartX.current > 150) {
      // Swipe right
      setCurCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : cards.length - 1));
    }
  };

  const rubInputFieldChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    const rubValue = parseFloat(value);

    if (!isNaN(rubValue)) {
      setRubAmount(rubValue);
      setCurrencyAmmount(rubValue * currencies[CurcurrentIndex].cource);
    } else {
      setRubAmount(0);
      setCurrencyAmmount(0);
    }
  };

  const currencyInputFieldChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    const currencyValue = parseFloat(value);

    if (!isNaN(currencyValue)) {
      setCurrencyAmmount(currencyValue);
      setRubAmount(currencyValue / currencies[CurcurrentIndex].cource);
    } else {
      setCurrencyAmmount(0);
      setRubAmount(0);
    }
  };

  useEffect(() => {
    setCurrencyAmmount(rubAmmount * currencies[CurcurrentIndex].cource);
  }, [CurcurrentIndex]);

  useEffect(() => {
    setIsOk(
      () => rubAmmount <= cards[CardcurrentIndex].balance && rubAmmount > 0 && cards[CardcurrentIndex].balance > 0,
    );
  }, [rubAmmount]);

  useEffect(() => {
    setIsOk(
      () => rubAmmount <= cards[CardcurrentIndex].balance && rubAmmount > 0 && cards[CardcurrentIndex].balance > 0,
    );
  }, [CardcurrentIndex]);

  return (
    <div className={'page ' + styles.container}>
      <div className={styles.header}>
        <button onClick={() => moveTo(spareWaypoint)}>{'<'}</button>
        Покупка
      </div>
      {/* slider for cards */}
      <div
        className={styles.Slider}
        onTouchStart={cardTohandleTouchStart}
        onTouchMove={cardTohandleTouchMove}
        onTouchEnd={cardTohandleTouchEnd}
        draggable="false"
      >
        <div
          className={styles.SliderWrapper}
          style={{ transform: `translateX(-${CardcurrentIndex * 100}%)` }}
          draggable="false"
        >
          {cards.map((card) => (
            <div className={styles.cardWrapper}>
              <h1 className={styles.cardName}>{card.CardName ? card.CardName : 'Digital card'}</h1>
              <h2 className={styles.cardHolder}>{card.cardHolderName ? card.cardHolderName : 'CARD HOLDER'}</h2>
              <div className={styles.cardBottomInfo}>
                <p className={styles.cardNumber}>{'• ' + card.cardNumber.slice(-4)}</p>
                <p className={styles.cardBalance}>{card.balance.toFixed(2) + ' ₽'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* input for rub */}
      <div className={styles.inputWrapper}>
        <input type="number" placeholder="0" value={rubAmmount.toFixed(2)} onChange={rubInputFieldChange} />
      </div>
      {/* slider for currencies */}
      <div
        className={styles.Slider}
        onTouchStart={CurTohandleTouchStart}
        onTouchMove={CurTohandleTouchMove}
        onTouchEnd={CurTohandleTouchEnd}
      >
        <div className={styles.SliderWrapper} style={{ transform: `translateX(-${CurcurrentIndex * 100}%)` }}>
          {currencies.map((currency) => (
            <div className={styles.cardWrapper + ' ' + styles.currencyCard}>
              <div className={styles.CurrencyInfoWrapper}>
                <h1 className={styles.cardName}>{currency.currency}</h1>
                <h2 className={styles.cardHolder}>{currency.currency === CurrencyEnum.BTC ? 'Bitcoin' : 'Ethereum'}</h2>
              </div>
              <p className={styles.curCource} style={{ fontSize: '20px' }}>
                {currency.cource.toFixed(6) + ' ₽'}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* input for ammount */}
      <div className={styles.inputWrapper}>
        <input type="number" value={currencyAmmount.toFixed(6)} onChange={currencyInputFieldChange} />
      </div>
      <button
        disabled={!isOk}
        className={styles.buyBtn + ' button '}
        onClick={() => (isOk ? moveTo(waypoint) : console.log('nope'))}
      >
        Купить
      </button>
    </div>
  );
};
