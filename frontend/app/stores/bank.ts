import { defineStore } from 'pinia';

export type BankAccount = { bank: string; num: string; holder: string; bindDate: string };

export const useBankStore = defineStore('bank', {
  state: () => ({
    accounts: [
      { bank: 'KB Bank', num: '**** **** **** 1234', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-08-14' },
      { bank: 'Shinhan Bank', num: '**** **** **** 5678', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-09-05' },
      { bank: 'Woori Bank', num: '**** **** **** 9012', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-10-02' },
    ] as BankAccount[],
  }),
});
