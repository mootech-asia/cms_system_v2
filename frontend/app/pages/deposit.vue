<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { computed, ref } from 'vue';

type Method = 'bank' | 'crypto';
const method = ref<Method>('bank');
const step = ref<'form' | 'transfer'>('form');
const showSuccess = ref(false);
const amount = ref('₩ 10,000');
const selectedAmount = ref('10,000');
const promotion = ref<number | null>(null);
const cryptoAmount = ref('');
const cryptoPromotion = ref<number | null>(null);

const quickAmounts = ['10,000', '50,000', '100,000', '500,000', '1,000,000'];
function pickAmount(item: string) {
  selectedAmount.value = item;
  amount.value = '₩ ' + item;
}
const promos = [
  {
    title: 'New Sign-up First Deposit 50%',
    notes: [
      'Note: This event is not applicable to Evolution Gaming and Pragmatic Play casino games.',
      'Rollover Requirement: The rollover for all funds is calculated as 300% of (Deposit Amount + Bonus).',
      'Bets with odds less than 1.7 will not count towards the rollover requirement.',
    ],
  },
  {
    title: 'Exclusive to Evolution Gaming, Pragmatic Play Casinos Unlimited Deposit...',
    notes: [
      'The rollover for all funds is (Deposit Amount + Bonus) multiplied by',
      'Maximum Bonus Amount: ₩200,000.',
      'Withdrawal Rollover Condition: 10 times (1,000%).',
      'Example: Deposit ₩1,000,000, receive a ₩200,000 bonus.',
      '(1,000,000 + 200,000) X 10 = 12,000,000',
    ],
  },
];
const cryptoPromos = [
  '[USDT only] Slot Daily First Deposit 5%',
  '[USDT only] Casino Reload 5%',
  '[USDT only] Slot Reload 5%',
];
const converted = computed(() => {
  const value = Number(cryptoAmount.value.replace(/[^\d]/g, ''));
  return value > 0 ? (value / 1516.98).toFixed(2) : '0.00';
});
const bankReady = computed(() => Number(amount.value.replace(/[^\d]/g, '')) > 0 && promotion.value !== null);
const cryptoReady = computed(() => Number(cryptoAmount.value.replace(/[^\d]/g, '')) > 0 && cryptoPromotion.value !== null);
</script>

<template>
  <div>
        <h1 class="text-white text-2xl md:text-3xl mb-6 md:mb-8">Deposit</h1>
        <div v-show="step === 'form'" class="payment-tabs">
          <button :class="{ active: method === 'bank' }" @click="method = 'bank'">
            <AppIcon name="card" /><span>Bank Card</span>
          </button>
          <button :class="{ active: method === 'crypto' }" @click="method = 'crypto'">
            <AppIcon name="bitcoin" /><span>Crypto Wallet</span>
          </button>
        </div>

        <section v-if="step === 'form' && method === 'bank'" class="payment-card">
          <h2 class="pay-section-title">Deposit Amount</h2>
          <div class="amount-grid">
            <button
              v-for="item in quickAmounts"
              :key="item"
              :class="{ selected: selectedAmount === item }"
              @click="pickAmount(item)"
            >{{ item }}</button>
          </div>
          <input v-model="amount" class="pay-field" placeholder="₩ 10,000" aria-label="Deposit amount">
          <p class="pay-note">* Minimum Amount: ₩ 10,000;  Maximum Amount: ₩ 9,000,000 *</p>

          <h2 class="pay-section-title mt-8">Choose promotion</h2>
          <button
            v-for="(promo, index) in promos"
            :key="promo.title"
            class="promo-card"
            :class="{ selected: promotion === index }"
            @click="promotion = index"
          >
            <span class="pay-radio"><span v-if="promotion === index" /></span>
            <span class="min-w-0 text-left">
              <strong>{{ promo.title }}</strong>
              <span v-for="line in promo.notes" :key="line" class="block mt-1 text-xs md:text-sm text-gray-300">• {{ line }}</span>
            </span>
          </button>
          <button class="pay-action" :class="{ ready: bankReady }" :disabled="!bankReady" @click="step = 'transfer'">Next</button>
        </section>

        <section v-if="step === 'form' && method === 'crypto'" class="payment-card">
          <h2 class="pay-section-title">Deposit Info</h2>
          <div class="crypto-method"><span>₮</span> USDT TRC20</div>
          <div class="pay-form-grid">
            <label>Deposit Amounts:</label>
            <div>
              <input v-model="cryptoAmount" class="pay-field" inputmode="numeric" placeholder="Deposit Amounts">
              <p class="pay-note">Deposit Limit: ₩ 50,000 (32.96 USDT) - ₩ 8,999,999 (5,932.83 USDT)</p>
            </div>
            <label>Converted Crypto Amount:</label>
            <div class="converted"><input class="pay-field" :value="converted" disabled><strong>USDT</strong></div>
          </div>
          <p class="rate">Exchange rate: <strong>1 USDT = ₩ 1,516.98</strong></p>

          <h2 class="pay-section-title">Choose promotion</h2>
          <button
            v-for="(promo, index) in cryptoPromos"
            :key="promo"
            class="crypto-promo"
            :class="{ selected: cryptoPromotion === index }"
            @click="cryptoPromotion = index"
          >
            <span class="pay-radio"><span v-if="cryptoPromotion === index" /></span>
            <strong>{{ promo }}</strong>
            <span class="amount">≥₩ 10,000.00</span>
          </button>
          <button class="pay-action" :class="{ ready: cryptoReady }" :disabled="!cryptoReady">Apply for Deposit</button>
        </section>

        <section v-if="step === 'transfer'" class="payment-card transfer">
          <div class="transfer-pill">Transfer Details</div>
          <div class="trow"><span class="tlabel">Deposit Amount</span><span class="tamount">{{ amount }}</span></div>
          <div class="trow"><span class="tlabel">Deposit Account</span><span class="tvalue">wururu1234</span></div>
          <p class="tnote">Once the transfer is complete, please click the "Complete" button below. Should you have any questions, please feel free to contact our Customer Service team.</p>
          <p class="tcs"><NuxtLink to="/support">Customer Service</NuxtLink></p>
          <button class="complete" @click="showSuccess = true"><span>Complete</span></button>
        </section>
    <MemberModal v-if="showSuccess" type="success" message="Deposit request submitted successfully." @confirm="showSuccess = false" @cancel="showSuccess = false" />
  </div>
</template>

