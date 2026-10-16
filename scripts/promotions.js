/**
 * AliFilter - AliExpress Promotions & Hot Deals Data Engine
 * 
 * [원격 자동 동기화 & 로컬 캐시 아키텍처]
 * - GitHub 저장소(raw.githubusercontent.com)의 promotions.json을 원격에서 주기적(6시간)으로 페치
 * - chrome.storage.local에 캐싱하여 네트워크 지연 없이 즉시 로드
 * - 오프라인이거나 네트워크 오류 시 아래 내장 기본값(FALLBACK_PROMOTIONS)으로 100% 안전 Fallback
 * - GitHub에서 JSON 수정 시 브라우저 재배포/구글 웹스토어 심사 없이 모든 사용자에게 실시간 반영
 */

(function () {
  'use strict';

  // 1. 내장 기본 데이터 (네트워크 실패/오프라인 시 사용되는 안전망)
  const FALLBACK_PROMOTIONS = {
    meta: {
      trackingId: 'alifilter',
      updatedAt: '2026-10',
      titleKo: '10월 알리 특별 프로모션 & 검증 핫딜',
      titleEn: 'AliExpress Monthly Deals & Promo Codes'
    },
    couponCenter: {
      titleKo: '이달의 공식 전회원 쿠폰팩',
      titleEn: 'Monthly Official Coupon Pack',
      descKo: '선착순 결제 즉시할인 & 알리 코인 최대 혜택',
      descEn: 'Checkout discounts & max coin rewards',
      badgeKo: '혜택',
      badgeEn: 'Bonus',
      btnKo: '쿠폰팩 받기',
      btnEn: 'Claim Pack',
      link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
    },
    coupons: [
      {
        id: 'coupon_1',
        titleKo: '$29 이상 구매 시 $3 즉시 할인',
        titleEn: '$3 OFF on orders over $29',
        code: 'ALIFILTER03',
        badge: '선착순',
        badgeEn: 'Limited',
        descKo: '모든 알리익스프레스 직구 상품 적용 가능',
        descEn: 'Applicable to global items'
      },
      {
        id: 'coupon_2',
        titleKo: '$69 이상 구매 시 $8 즉시 할인',
        titleEn: '$8 OFF on orders over $69',
        code: 'ALIFILTER08',
        badge: '인기',
        badgeEn: 'Popular',
        descKo: '가전/디지털/캠핑 카테고리 강력 추천',
        descEn: 'Great for Electronics & Outdoor'
      },
      {
        id: 'coupon_3',
        titleKo: '$139 이상 구매 시 $18 즉시 할인',
        titleEn: '$18 OFF on orders over $139',
        code: 'ALIFILTER18',
        badge: '슈퍼세일',
        badgeEn: 'Super Deal',
        descKo: '장바구니 결제 단계에서 코드 입력',
        descEn: 'Enter promo code at checkout'
      }
    ],
    hotdeals: [
      {
        id: 'deal_1',
        category: 'charging',
        titleKo: 'Baseus 65W GaN5 Pro 초고속 멀티 충전기',
        titleEn: 'Baseus 65W GaN5 Pro Fast Charger',
        tagKo: '★ 4.9 베스트셀러',
        tagEn: '★ 4.9 Best Seller',
        originalPrice: '₩38,000',
        salePrice: '₩19,200',
        discount: '49% OFF',
        rating: '4.9',
        orders: '24,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_2',
        category: 'charging',
        titleKo: 'Essager 100W C-to-C 디지털 디스플레이 고속 케이블',
        titleEn: 'Essager 100W C-to-C Fast Cable with LED Display',
        tagKo: '초가성비 1위',
        tagEn: 'Top Value Cable',
        originalPrice: '₩8,200',
        salePrice: '₩3,900',
        discount: '52% OFF',
        rating: '4.9',
        orders: '45,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_3',
        category: 'pc',
        titleKo: 'UGREEN 블루투스 5.4 마우스 무소음 슬림',
        titleEn: 'UGREEN Wireless Bluetooth 5.4 Silent Mouse',
        tagKo: '사무용 가성비 1위',
        tagEn: 'Top Office Value',
        originalPrice: '₩22,000',
        salePrice: '₩11,400',
        discount: '48% OFF',
        rating: '4.8',
        orders: '18,500+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_4',
        category: 'pc',
        titleKo: 'AULA F75 유무선 3모드 가스켓 기계식 키보드',
        titleEn: 'AULA F75 Tri-Mode Gasket Mechanical Keyboard',
        tagKo: '키보드 끝판왕',
        tagEn: 'Custom Top Pick',
        originalPrice: '₩82,000',
        salePrice: '₩48,000',
        discount: '41% OFF',
        rating: '4.9',
        orders: '12,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_5',
        category: 'audio',
        titleKo: 'Anker Soundcore P20i 무선 노이즈캔슬링 이어폰',
        titleEn: 'Anker Soundcore P20i True Wireless Earbuds',
        tagKo: '음질 종결 가성비',
        tagEn: 'High Fidelity Sound',
        originalPrice: '₩35,000',
        salePrice: '₩18,900',
        discount: '46% OFF',
        rating: '4.9',
        orders: '35,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_6',
        category: 'audio',
        titleKo: 'QCY T13 ANC 액티브 노이즈캔슬링 무선이어폰',
        titleEn: 'QCY T13 ANC Active Noise Cancelling Earbuds',
        tagKo: '가성비 노캔 1위',
        tagEn: 'Best Budget ANC',
        originalPrice: '₩33,600',
        salePrice: '₩16,800',
        discount: '50% OFF',
        rating: '4.8',
        orders: '62,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_7',
        category: 'life',
        titleKo: 'Baseus 차량용 초강력 미니 무선 청소기 A2 Pro',
        titleEn: 'Baseus A2 Pro Cordless Handheld Car Vacuum Cleaner',
        tagKo: '차량 필수품',
        tagEn: 'Car Essential',
        originalPrice: '₩52,000',
        salePrice: '₩28,500',
        discount: '45% OFF',
        rating: '4.9',
        orders: '19,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      },
      {
        id: 'deal_8',
        category: 'life',
        titleKo: '휴대용 디지털 무선 타이어 공기주입기 에어펌프',
        titleEn: 'Portable Smart Wireless Digital Tire Inflator Air Pump',
        tagKo: '비상용 필수템',
        tagEn: 'Emergency Must-Have',
        originalPrice: '₩39,800',
        salePrice: '₩21,000',
        discount: '47% OFF',
        rating: '4.8',
        orders: '28,000+',
        link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
      }
    ]
  };

  // 즉시 전역 데이터 초기화 (동기 렌더링 지원)
  window.__ALI_PROMOTIONS__ = JSON.parse(JSON.stringify(FALLBACK_PROMOTIONS));

  // 2. 원격 동기화 관리자 모듈
  const RAW_URL = 'https://raw.githubusercontent.com/ff8scall/AliFilter/main/promotions.json';
  const CACHE_KEY = 'alifilter_remote_promotions';
  const CACHE_TIME_KEY = 'alifilter_remote_promotions_time';
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6시간 TTL

  const subscribers = new Set();

  function isValidPromotions(data) {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.coupons) &&
      Array.isArray(data.hotdeals) &&
      data.coupons.length > 0
    );
  }

  function notifySubscribers(data) {
    subscribers.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.warn('[AliFilter] Subscriber error:', err);
      }
    });
  }

  async function fetchRemotePromotions() {
    try {
      // 캐시 버스팅 파라미터 적용 (GitHub CDN 캐시 즉시 우회)
      const fetchUrl = `${RAW_URL}?_t=${Date.now()}`;
      const response = await fetch(fetchUrl, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const remoteData = await response.json();
      if (!isValidPromotions(remoteData)) {
        throw new Error('Invalid promotions JSON schema');
      }

      // 로컬 스토리지에 캐싱
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          [CACHE_KEY]: remoteData,
          [CACHE_TIME_KEY]: Date.now()
        });
      }

      window.__ALI_PROMOTIONS__ = remoteData;
      notifySubscribers(remoteData);
      return remoteData;
    } catch (err) {
      console.warn('[AliFilter] Remote promotions sync skipped, using local fallback:', err.message);
      return null;
    }
  }

  async function init() {
    // 1단계: 로컬 캐시 확인
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      try {
        const stored = await chrome.storage.local.get([CACHE_KEY, CACHE_TIME_KEY]);
        const cachedData = stored[CACHE_KEY];
        const cachedTime = stored[CACHE_TIME_KEY] || 0;
        const isFresh = Date.now() - cachedTime < CACHE_TTL_MS;

        if (isValidPromotions(cachedData)) {
          window.__ALI_PROMOTIONS__ = cachedData;
          notifySubscribers(cachedData);
        }

        // 캐시가 없거나 만료되었으면 백그라운드 원격 동기화
        if (!isFresh || !isValidPromotions(cachedData)) {
          fetchRemotePromotions();
        }
      } catch (e) {
        fetchRemotePromotions();
      }
    } else {
      // Chrome storage가 없는 테스트 환경인 경우
      fetchRemotePromotions();
    }
  }

  window.AliPromotionsManager = {
    init: init,
    syncNow: fetchRemotePromotions,
    subscribe: function (callback) {
      if (typeof callback === 'function') {
        subscribers.add(callback);
      }
      return () => subscribers.delete(callback);
    },
    getData: function () {
      return window.__ALI_PROMOTIONS__ || FALLBACK_PROMOTIONS;
    }
  };

  // 백그라운드 초기화 자동 실행
  init();
})();
