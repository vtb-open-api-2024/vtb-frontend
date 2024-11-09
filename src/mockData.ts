import { Card, CurrencyEnum, Wallet } from "./types";

export const bindCardPopupData = {
  waypoint: '/bind-card',
  msg: 'Добавьте карту и покупайте валюту прямо в свой кошелек',
  desc: '',
  img: 'src/assets/creditCard.png',
};

export const inviteFriendPopupData = {
  waypoint: '/share-app',
  msg: 'Поздравляем с первой сделкой',
  desc: 'Рекомендуйте приложение друзьям!',
  img: 'src/assets/creditCard.png',
};

export const firstWallet: Wallet = {
  id: '0',
  name: 'Mock Wallet',
  currensies: [
    {
      currency: {
        currency: CurrencyEnum.BTC,
        cource: 100,
      },
      ammount: 100,
    },
    {
      currency: {
        currency: CurrencyEnum.ETC,
        cource: 100,
      },
      ammount: 0.45,
    },
  ],
};

export const cards: Card[] = [
  {
    id: '0',
    cardHolderName: undefined,
    CardName: 'Карта ВТБ',
    cardNumber: '2002200220022002',
    cardExpiryDate: undefined,
    balance: 10000,
  },
  {
    id: '1',
    cardHolderName: undefined,
    CardName: 'VTB Card',
    cardNumber: '200220022002222',
    cardExpiryDate: undefined,
    balance: 10500,
  },
];
