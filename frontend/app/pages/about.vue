<script setup lang="ts">
import { ref } from 'vue';

const tabs = [
  { key: 'support', label: 'Support' },
  { key: 'notice', label: 'Notice' },
  { key: 'about', label: 'About' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'info', label: 'Info' },
  { key: 'addiction', label: 'Addiction' },
  { key: 'rules', label: 'Rules' },
  { key: 'faq', label: 'FAQ' },
];

const cards: Record<string, { title: string; body: string }[]> = {
  support: [{ title: '', body: 'Please contact customer service.' }],
  notice: [
    { title: 'Urgent Notice - WIN100% official Telegram updated.', body: 'There has been an increase in impersonators pretending to be WIN100%.\nWIN100% provides guidance only through one official Telegram. If there is an issue with the existing Telegram, we will announce it only via this channel or live chat.\n\nOfficial WIN100% Telegram announcement channel: https://t.me/win100kor\n\nIf you cannot reach us through the previous Telegram, please contact us via live chat to verify and proceed to avoid impersonation.' },
    { title: 'How to inquire about deposit account', body: 'For deposit account inquiries, please register first and then contact us via live chat or the customer service Telegram.' },
  ],
  about: [
    { title: 'About WIN100%', body: 'This policy describes how WIN100% ("we") uses the information and data provided by customers and how it is handled between WIN100% and customers.\n\nWe process your personal information based on the provisions provided through the WIN100% (or website) registration form or other methods, or based on personal information we already hold. By submitting your information and using the site, you agree to the use of your information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use the site or provide personal information.' },
  ],
  privacy: [
    { title: 'Privacy Policy', body: 'This policy explains how your personal information is collected, used, and protected by WIN100%. We only provide guidance via our official channels. If the existing channel has issues, announcements will be made via this page or live chat only.' },
    { title: 'Data collection and usage', body: 'We collect, use, and dispose of information and data about you including:\n1. Any information submitted via email or the website;\n2. Any other means that record communications via email, phone, or chat;\n3. Responses to surveys or customer questionnaires;\n4. Transaction history related to the website;\n5. Details of site visits such as traffic data, location data, blogs, and other communication data.\n\nYour personal information is processed for the following purposes:\n1. Payment transactions, including offline and online payments;\n2. Betting transactions;\n3. Managing customer accounts and building member profiles;\n4. Compliance with our legal and regulatory obligations;\n5. Customer research, surveys, and analytics;\n6. Events, products, and services;\n7. Preventing fraud, irregular betting activity, money laundering, bonus abuse, collusion, and monitoring transactions between customers for misconduct.' },
  ],
  info: [
    { title: 'Additional Information', body: 'WIN100% is not responsible for the content or accuracy of internal or external websites.\nAll information provided by the company is based on facts; however, the company is not liable for errors or omissions related to the information. The company reserves the right to correct obvious errors.\nWe reserve the exclusive right to amend, update, and modify these Terms of Use from time to time.\nRevised, updated, or modified terms will be posted on the website(s) and will take effect immediately upon posting.' },
  ],
  addiction: [
    { title: 'Responsible Gaming', body: 'WIN100% encourages members to enjoy gaming while preventing excessive play. We help members recognize their limits and set their own responsible gaming limits through the account management page.\nGaming is a form of entertainment and should not become an emotional or financial burden. Borrowing money or using funds for other purposes is unwise and can cause serious problems for you and those around you. We hope you enjoy games responsibly at WIN100%!\nIf you have questions about responsible gaming, please contact customer support. We offer help such as:\n1. Self-assessment\n2. Bet management\n3. Deposit limits\n4. Parental protection\n5. Help and suggestions' },
    { title: 'Self-assessment', body: '1. Do you play to escape from a boring or unhappy life?\n2. After losing, do you feel the urge to win back what you lost as soon as possible?\n3. When you play, do you tend to continue until all available funds are exhausted?\n4. Have you ever lied to conceal the amount of money or time spent on gambling?\n5. Have you lost interest in family, friends, or hobbies because of gambling?\n6. When you run out of money while playing, have you felt despair or disappointment and wanted to play again quickly?\n\nDo you feel depressed or suicidal due to gambling? If most of your answers are "Yes", you may be experiencing gambling addiction. For free and independent advice, please contact organizations such as Gambling Therapy (https://www.gamblingtherapy.org/) or contact us.' },
    { title: 'Bet management', body: 'While most people gamble recreationally, for some it can become a problem.\nYou may find it helpful to remember:\n1. Gambling should be fun and not seen as a way to make money.\n2. Only gamble within your financial means.\n3. Keep track of the time and money you spend on gambling.\n4. Consider installing gambling site blocking software such as Betfilter (www.betfilter.com) or Gamblock (www.gamblock.com) on your mobile or tablet.\n5. If you want to talk to someone about problem gambling, contact us or one of the organizations mentioned above.' },
  ],
  rules: [
    { title: 'Rules and Regulations', body: "WIN100% strictly penalizes members who register with the intention of using the site in abnormal ways such as arbitrage betting, using betting tools, reporting and hacking, intimidation, promotion abuse, or organized group betting. If a member is determined to have violated the stated rules and regulations, WIN100% reserves the right to confiscate the member's account without prior warning. By registering and using WIN100%, you are considered to understand and agree to all terms, rules, and regulations." },
    { title: 'Deposits and Withdrawals', body: "- If you deposit to an incorrect account without prior verification, WIN100% is not responsible for any resulting loss.\n- Unless otherwise stated in the event/promotion, all time references are based on GMT+8.\n- Deposit and withdrawal requests can only be made using the account holder's own registered bank details; requests using another person's details cannot be processed.\n- Bank account information cannot be registered under family, relatives, acquaintances, or any other names; it must match the actual user of the site.\n- The use of virtual accounts is strictly prohibited. Deposits or withdrawals using virtual accounts are not allowed.\n- If you deposit using an account that is not in your name, the deposit cannot be processed and WIN100% may request related documents to handle the transaction.\n- To prevent money laundering and financial fraud, the deposited amount must be wagered in full before withdrawals are allowed.\n- Deposits via checks or bills are not accepted." },
  ],
};

const faq = [
  {
    group: 'General Information',
    items: [
      { q: 'About WIN100%', a: 'WIN100% is an overseas betting site that provides trusted and verified games. From sports, slot games, live casinos to mini games, we are doing our best to closely follow the trends of online entertainment products. You can experience exciting games while receiving various benefits such as attractive promotions and bonuses like various customer loyalty programs.' },
      { q: 'Are the games provided on the site fair?', a: 'The WIN100% site is a legally registered company, and all game results are absolutely fair, impartial, and based on factual outcomes.' },
      { q: 'Is my personal information safe?', a: 'We prioritize your personal information above all else. WIN100% will never share your information with any third party unless required by regulations, applicable laws and regulations, or a court order.' },
    ],
  },
  {
    group: 'Account Management',
    items: [
      { q: 'How do I change my password?', a: 'After logging into the site, click Information Center > My Information. You can change your password through the "Login Password" menu.' },
      { q: 'I lost my password, how can I get it reissued?', a: 'If you have forgotten your account password, please click the "Forgot Password" button. Enter your username and the email address registered during signup. If the information provided is correct, a temporary password will be sent to your email.' },
    ],
  },
];

const paras = (t: string) => t.split('\n\n');

const route = useRoute();
const validTabs = tabs.map((t) => t.key);
const initial = typeof route.query.tab === 'string' && validTabs.includes(route.query.tab) ? route.query.tab : 'support';
const active = ref<string>(initial);
const open = ref<Set<string>>(new Set());
function toggle(id: string) {
  const s = new Set(open.value);
  s.has(id) ? s.delete(id) : s.add(id);
  open.value = s;
}
</script>

<template>
  <div>
    <section class="py-8 bg-surface-deep min-h-[600px]">
      <div class="container mx-auto px-4 max-w-5xl">
        <h1 class="relative mb-[22px] pb-3.5 text-[28px] font-extrabold uppercase tracking-[0.04em] text-ink after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-g-primary">ABOUT US</h1>
        <div class="flex flex-wrap gap-x-[26px] gap-y-2 border-b border-line-soft mb-7">
          <button
            v-for="t in tabs" :key="t.key"
            class="relative pb-3.5 bg-transparent border-0 text-[15px] font-semibold cursor-pointer"
            :class="active === t.key
              ? 'text-primary after:content-[\'\'] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:rounded-sm after:bg-g-primary'
              : 'text-ink-3 hover:text-ink-2'"
            @click="active = t.key"
          >{{ t.label }}</button>
        </div>

        <template v-for="t in tabs" :key="t.key">
          <div v-show="active === t.key">
            <template v-if="t.key !== 'faq'">
              <div v-for="(c, i) in cards[t.key]" :key="i" class="card-ui px-6 py-[22px] mb-[18px]">
                <h3 v-if="c.title" class="mb-3 text-[17px] font-bold text-primary">{{ c.title }}</h3>
                <div>
                  <p v-for="(p, pi) in paras(c.body)" :key="pi" class="mb-3.5 whitespace-pre-line text-body leading-[1.75] text-ink-2 last:mb-0">{{ p }}</p>
                </div>
              </div>
            </template>
            <template v-else>
              <template v-for="(grp, gi) in faq" :key="gi">
                <h3 class="mb-3.5 mt-[26px] text-base font-bold text-primary" :class="{ 'mt-0': gi === 0 }">{{ grp.group }}</h3>
                <div v-for="(it, ii) in grp.items" :key="ii" class="card-ui mb-3.5 overflow-hidden">
                  <button class="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-[18px] text-left text-[15px] font-bold text-ink" type="button" @click="toggle(`${gi}-${ii}`)">
                    <span>{{ it.q }}</span>
                    <svg
                      class="h-5 w-5 shrink-0 text-ink-3 transition-transform duration-200"
                      :class="{ 'rotate-180': open.has(`${gi}-${ii}`) }"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    ><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                  <div
                    class="overflow-hidden px-5 transition-[max-height] duration-[250ms] ease-in-out"
                    :class="open.has(`${gi}-${ii}`) ? 'max-h-[600px] pb-[18px]' : 'max-h-0'"
                  ><p class="whitespace-pre-line text-body leading-[1.75] text-ink-2">{{ it.a }}</p></div>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
