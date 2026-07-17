<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { computed, ref, watch } from 'vue';

type Gateway = 'a' | 'b' | 'c' | 'd';
type Method = 'bank' | 'linepay' | 'trc20' | 'erc20';
type ModalType = 'success' | 'warning';

const gateways: Array<{ id: Gateway; label: string; methodCount: number }> = [
  { id: 'a', label: 'Provider A', methodCount: 4 },
  { id: 'b', label: 'Provider B', methodCount: 3 },
  { id: 'c', label: 'Provider C', methodCount: 2 },
  { id: 'd', label: 'Provider D', methodCount: 1 },
];

const paymentMethods: Array<{ id: Method; label: string; icon: string }> = [
  { id: 'bank', label: 'Bank Card', icon: 'card' },
  { id: 'linepay', label: 'LinePay', icon: 'chat' },
  { id: 'trc20', label: 'USDT-TRC20', icon: 'bitcoin' },
  { id: 'erc20', label: 'USDT-ERC20', icon: 'bitcoin' },
];

const providerResults: Record<Gateway, { type: ModalType; title: string; message: string }> = {
  a: {
    type: 'success',
    title: 'Success!',
    message: '',
  },
  b: {
    type: 'warning',
    title: 'Warning',
    message: 'The maximum number of application attempts has been reached. Please contact customer support for assistance.',
  },
  c: {
    type: 'warning',
    title: 'Warning',
    message: 'Your application has been temporarily suspended due to too many failed transaction attempts. Please contact customer support for assistance.',
  },
  d: {
    type: 'warning',
    title: 'Warning',
    message: 'The requested amount has reached the maximum limit. Please contact customer support for assistance.',
  },
};

const { t } = useLocale();

const gateway = ref<Gateway>('a');
const method = ref<Method>('bank');
const step = ref<'form' | 'qr' | 'transfer'>('form');
const showResult = ref(false);
const amount = ref('₩ 10,000');
const selectedAmount = ref('10,000');
const promotion = ref<number | null>(null);
const cryptoAmount = ref('');
const cryptoPromotion = ref<number | null>(null);

const availablePaymentMethods = computed(() => {
  const count = gateways.find((item) => item.id === gateway.value)?.methodCount ?? paymentMethods.length;
  return paymentMethods.slice(0, count);
});
const usesCrypto = computed(() => method.value === 'trc20' || method.value === 'erc20');
const resultContent = computed(() => providerResults[gateway.value]);

// QR 中繼步驟(非 Bank Card 方式):Next/Apply 後先進這一步,再繼續到原本的下一步
const QR_SIZE = 21;
const qrFinderPositions = [
  { x: 0, y: 0 },
  { x: QR_SIZE - 7, y: 0 },
  { x: 0, y: QR_SIZE - 7 },
];
function isQrFinderZone(x: number, y: number) {
  return qrFinderPositions.some((pos) => x >= pos.x && x < pos.x + 7 && y >= pos.y && y < pos.y + 7);
}
function seededQrModules(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const cells: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      if (isQrFinderZone(x, y)) continue;
      hash = (hash * 1103515245 + 12345) >>> 0;
      if (((hash >>> 16) & 1) === 1) cells.push({ x, y });
    }
  }
  return cells;
}

const mockPaymentAddresses: Record<Exclude<Method, 'bank'>, string> = {
  linepay: 'https://line.example/pay/8f3c1a92b7d4e05f',
  trc20: 'TXf9K2mNq7QeYzR3sD8pL1cWvA6bH4gU5t',
  erc20: '0x7c3F9aE45bD218e6A0c9F5b3D8a41E2C6B7d9F0A',
};
const paymentInfo = computed(() => {
  const isAddress = method.value === 'trc20' || method.value === 'erc20';
  const value = mockPaymentAddresses[method.value as Exclude<Method, 'bank'>] ?? mockPaymentAddresses.linepay;
  return { label: isAddress ? t('deposit.qr.addressLabel') : t('deposit.qr.linkLabel'), value };
});
const qrModules = computed(() => seededQrModules(`${method.value}|${paymentInfo.value.value}`));

const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;
async function copyAddress() {
  try {
    await navigator.clipboard.writeText(paymentInfo.value.value);
    copied.value = true;
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => { copied.value = false; }, 1500);
  } catch {
    // clipboard 不可用(權限/非安全連線)— 純占位流程,靜默忽略
  }
}

function proceedFromForm() {
  step.value = method.value === 'bank' ? 'transfer' : 'qr';
}
function completeQrStep() {
  if (usesCrypto.value) {
    submitApplication();
  } else {
    step.value = 'transfer';
  }
}

watch(gateway, () => {
  if (!availablePaymentMethods.value.some((item) => item.id === method.value)) {
    method.value = availablePaymentMethods.value[0]?.id ?? 'bank';
  }
});

const quickAmounts = ['10,000', '50,000', '100,000', '500,000', '1,000,000'];
function pickAmount(item: string) {
  selectedAmount.value = item;
  amount.value = '₩ ' + item;
}
function submitApplication() {
  showResult.value = true;
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
    <h1 class="text-ink text-2xl md:text-3xl mb-6 md:mb-8">Deposit</h1>

    <!-- 閘道商選擇:底線頁簽(與 withdrawal 的 .mode-tabs 同一份定義) -->
    <div v-show="step === 'form'" class="mode-tabs">
      <button
        v-for="item in gateways"
        :key="item.id"
        :class="{ active: gateway === item.id }"
        @click="gateway = item.id"
      >
        <span class="leading-tight">{{ item.label }}</span>
      </button>
    </div>

    <div v-show="step === 'form'" class="payment-tabs flex-wrap md:flex-nowrap">
      <button
        v-for="item in availablePaymentMethods"
        :key="item.id"
        class="!min-w-0 flex-1 basis-[48%] md:basis-0"
        :class="{ active: method === item.id }"
        @click="method = item.id"
      >
        <AppIcon :name="item.icon" /><span>{{ item.label }}</span>
      </button>
    </div>

    <section v-if="step === 'form' && !usesCrypto" class="payment-card">
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
      <p class="pay-note">* Minimum Amount: ₩ 10,000; Maximum Amount: ₩ 9,000,000 *</p>

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
          <span v-for="line in promo.notes" :key="line" class="block mt-1 text-xs md:text-sm text-ink-2">• {{ line }}</span>
        </span>
      </button>
      <button class="pay-action" :class="{ ready: bankReady }" :disabled="!bankReady" @click="proceedFromForm">Next</button>
    </section>

    <section v-if="step === 'form' && usesCrypto" class="payment-card">
      <h2 class="pay-section-title">Deposit Info</h2>
      <div class="pay-form-grid mt-6">
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
      <button
        class="pay-action"
        :class="{ ready: cryptoReady }"
        :disabled="!cryptoReady"
        @click="step = 'qr'"
      >Apply for Deposit</button>
    </section>

    <section v-if="step === 'qr'" class="payment-card text-center">
      <div class="transfer-pill">{{ t('deposit.qr.pill') }}</div>
      <p class="text-ink-2 text-sm md:text-base mb-6">{{ t('deposit.qr.hint') }}</p>

      <div class="mb-6 flex w-full justify-center">
        <div class="rounded-ui overflow-hidden">
          <!-- QR 一律黑白(掃描對比需求,業主 2026-07-17),不套主題 token -->
          <svg viewBox="-2 -2 25 25" class="h-[196px] w-[196px]" role="img" :aria-label="t('deposit.qr.altText')">
            <rect x="-2" y="-2" width="25" height="25" fill="#ffffff" />
            <template v-for="pos in qrFinderPositions" :key="`f-${pos.x}-${pos.y}`">
              <rect :x="pos.x" :y="pos.y" width="7" height="7" fill="#000000" />
              <rect :x="pos.x + 1" :y="pos.y + 1" width="5" height="5" fill="#ffffff" />
              <rect :x="pos.x + 2" :y="pos.y + 2" width="3" height="3" fill="#000000" />
            </template>
            <rect
              v-for="cell in qrModules"
              :key="`c-${cell.x}-${cell.y}`"
              :x="cell.x"
              :y="cell.y"
              width="1"
              height="1"
              fill="#000000"
            />
          </svg>
        </div>
      </div>

      <div class="mx-auto mb-2 max-w-md text-left">
        <label class="mb-2 block text-sm font-semibold text-ink-2">{{ paymentInfo.label }}</label>
        <div class="flex gap-2.5">
          <input class="pay-field" :value="paymentInfo.value" readonly>
          <button type="button" class="btn-ghost btn-md shrink-0" @click="copyAddress">
            {{ copied ? t('deposit.qr.copied') : t('deposit.qr.copy') }}
          </button>
        </div>
      </div>

      <p class="mx-auto mb-6 max-w-md text-xs text-ink-3 md:text-sm">{{ t('deposit.qr.note') }}</p>

      <div class="flex items-center justify-between gap-4">
        <button type="button" class="btn-back" @click="step = 'form'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          <span>{{ t('action.back') }}</span>
        </button>
        <button type="button" class="pay-action ready !mt-0 flex-1" @click="completeQrStep">{{ t('deposit.qr.confirm') }}</button>
      </div>
    </section>

    <section v-if="step === 'transfer'" class="payment-card transfer">
      <div class="transfer-pill">Transfer Details</div>
      <div class="trow"><span class="tlabel">Deposit Amount</span><span class="tamount">{{ amount }}</span></div>
      <div class="trow"><span class="tlabel">Deposit Account</span><span class="tvalue">wururu1234</span></div>
      <p class="tnote">Once the transfer is complete, please click the "Complete" button below. Should you have any questions, please feel free to contact our Customer Service team.</p>
      <p class="tcs"><NuxtLink to="/support">Customer Service</NuxtLink></p>
      <button class="complete" @click="submitApplication"><span>Complete</span></button>
    </section>

    <MemberModal
      v-if="showResult"
      :type="resultContent.type"
      :title="resultContent.title"
      :message="resultContent.message"
      @confirm="showResult = false"
      @cancel="showResult = false"
    />
  </div>
</template>
