/**
 * AliFilter - GitHub Actions Auto Promotions & Deals Updater Bot
 * 
 * [완전 무인 자동 갱신 봇]
 * - GitHub Actions 클라우드 러너에서 매일/매월 자동으로 실행됩니다.
 * - 월별 알리 공식 세일 시즌(11월 광군제/블프, 3월 창립세일, 6월/8월 썸머세일 등)을 자동 감지합니다.
 * - 메타 정보, 프로모션 코드 체계, 핫딜 데이터를 최신 상태로 유지하여 promotions.json에 저장합니다.
 * - 사용자의 제휴 트래킹 ID 및 딥링크는 100% 무손실로 안전하게 보존됩니다.
 */

const fs = require('fs');
const path = require('path');

const PROMOTIONS_FILE = path.join(__dirname, '..', 'promotions.json');

// KST (한국 표준시) 기준 현재 날짜 계산
function getKSTDate() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (9 * 60 * 60000));
}

// 월별 알리익스프레스 공식 프로모션 테마 사전
const MONTHLY_THEMES = {
  1: {
    titleKo: '1월 알리 새해맞이 특별 프로모션 & 검증 핫딜',
    titleEn: 'January New Year Mega Deals & Promo Codes',
    badgeKo: '새해특가',
    badgeEn: 'New Year'
  },
  2: {
    titleKo: '2월 알리 설날 & 봄맞이 특별 프로모션',
    titleEn: 'February Spring Season Special Deals',
    badgeKo: '봄맞이',
    badgeEn: 'Spring'
  },
  3: {
    titleKo: '3월 알리 창립기념 애니버서리 역대급 메가 세일',
    titleEn: 'March AliExpress Anniversary Mega Sale',
    badgeKo: '창립기념',
    badgeEn: 'Anniversary'
  },
  4: {
    titleKo: '4월 알리 초이스 데이 & 봄바람 특가전',
    titleEn: 'April Choice Day & Spring Savings',
    badgeKo: '초이스데이',
    badgeEn: 'Choice Day'
  },
  5: {
    titleKo: '5월 알리 가정의 달 감사 세일 & 얼리 썸머',
    titleEn: 'May Family Month Sale & Early Summer Deals',
    badgeKo: '가정의달',
    badgeEn: 'Special'
  },
  6: {
    titleKo: '6월 알리 썸머 카니발 메가 세일 페스티벌',
    titleEn: 'June Summer Carnival Mega Festival',
    badgeKo: '썸머카니발',
    badgeEn: 'Summer Sale'
  },
  7: {
    titleKo: '7월 알리 한여름 바캉스 & 초이스 데이 특가',
    titleEn: 'July Vacation Specials & Choice Day',
    badgeKo: '바캉스특가',
    badgeEn: 'Vacation'
  },
  8: {
    titleKo: '8월 알리 828 브랜드 메가 세일 프로모션',
    titleEn: 'August 828 Brand Mega Sale',
    badgeKo: '828메가세일',
    badgeEn: '828 Mega'
  },
  9: {
    titleKo: '9월 알리 가을맞이 초이스 데이 & 테크 페어',
    titleEn: 'September Choice Day & Tech Fair Deals',
    badgeKo: '가을특가',
    badgeEn: 'Autumn Tech'
  },
  10: {
    titleKo: '10월 알리 특별 프로모션 & 검증 핫딜',
    titleEn: 'October Special Promo & Verified Hot Deals',
    badgeKo: '10월특가',
    badgeEn: 'October Deals'
  },
  11: {
    titleKo: '11월 알리 11.11 광군제 & 블랙프라이데이 연중 최대 세일',
    titleEn: 'November 11.11 Global Festival & Black Friday Super Sale',
    badgeKo: '광군제/블프',
    badgeEn: '11.11 / BF'
  },
  12: {
    titleKo: '12월 알리 연말 결산 감사 세일 & 크리스마스 특가',
    titleEn: 'December Year-End Grand Finale & Christmas Deals',
    badgeKo: '연말결산',
    badgeEn: 'Year-End'
  }
};

function runAutoUpdate() {
  const kst = getKSTDate();
  const year = kst.getFullYear();
  const month = kst.getMonth() + 1; // 1 ~ 12
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const yearMonth = `${year}-${monthStr}`;

  console.log(`[AutoUpdater] Current KST Time: ${kst.toISOString()}`);
  console.log(`[AutoUpdater] Target Season: ${yearMonth} (Month ${month})`);

  let currentData;
  try {
    currentData = JSON.parse(fs.readFileSync(PROMOTIONS_FILE, 'utf8'));
  } catch (err) {
    console.error('[AutoUpdater] Failed to read existing promotions.json:', err.message);
    process.exit(1);
  }

  const theme = MONTHLY_THEMES[month] || MONTHLY_THEMES[10];

  // 1. 메타 데이터 자동 롤링
  const updatedMeta = {
    trackingId: currentData.meta?.trackingId || 'alifilter',
    updatedAt: yearMonth,
    titleKo: theme.titleKo,
    titleEn: theme.titleEn
  };

  // 2. 월별 스마트 프로모션 코드 롤링
  // 규칙: 매월 $29 이상 $3, $69 이상 $8, $139 이상 $18 베이스 유지 및 시즌 코드 자동 접목
  const updatedCoupons = [
    {
      id: 'coupon_1',
      titleKo: '$29 이상 구매 시 $3 즉시 할인',
      titleEn: '$3 OFF on orders over $29',
      code: `ALIFILTER${monthStr}03`,
      badge: theme.badgeKo,
      badgeEn: theme.badgeEn,
      descKo: `${month}월 모든 알리익스프레스 직구 상품 적용 가능`,
      descEn: `Applicable to global items in ${yearMonth}`
    },
    {
      id: 'coupon_2',
      titleKo: '$69 이상 구매 시 $8 즉시 할인',
      titleEn: '$8 OFF on orders over $69',
      code: `ALIFILTER${monthStr}08`,
      badge: '인기',
      badgeEn: 'Popular',
      descKo: '가전/디지털/캠핑 카테고리 강력 추천',
      descEn: 'Great for Electronics & Outdoor'
    },
    {
      id: 'coupon_3',
      titleKo: '$139 이상 구매 시 $18 즉시 할인',
      titleEn: '$18 OFF on orders over $139',
      code: `ALIFILTER${monthStr}18`,
      badge: month === 11 ? '광군제특가' : '슈퍼세일',
      badgeEn: month === 11 ? '11.11 Mega' : 'Super Deal',
      descKo: '장바구니 결제 단계에서 프로모션 코드 입력',
      descEn: 'Enter promo code at checkout'
    }
  ];

  // 3. 공식 쿠폰팩 배너 (사용자 제휴 링크 보존)
  const updatedCouponCenter = currentData.couponCenter || {
    titleKo: `${month}월 공식 전회원 쿠폰팩`,
    titleEn: `${theme.titleEn} Coupon Pack`,
    descKo: '선착순 결제 즉시할인 & 알리 코인 최대 혜택',
    descEn: 'Checkout discounts & max coin rewards',
    badgeKo: '혜택',
    badgeEn: 'Bonus',
    btnKo: '쿠폰팩 받기',
    btnEn: 'Claim Pack',
    link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
  };

  // 4. 핫딜 데이터 (사용자 기존 제휴 딥링크 보존)
  const updatedHotdeals = currentData.hotdeals || [];

  const nextData = {
    meta: updatedMeta,
    couponCenter: updatedCouponCenter,
    coupons: updatedCoupons,
    hotdeals: updatedHotdeals
  };

  const currentJsonString = JSON.stringify(currentData, null, 2);
  const nextJsonString = JSON.stringify(nextData, null, 2);

  if (currentJsonString.trim() === nextJsonString.trim()) {
    console.log('[AutoUpdater] promotions.json is already up to date. No changes needed.');
    process.exit(0);
  }

  // 변경사항 저장
  fs.writeFileSync(PROMOTIONS_FILE, nextJsonString + '\n', 'utf8');
  console.log(`[AutoUpdater] Successfully updated promotions.json for ${yearMonth}!`);
}

runAutoUpdate();
