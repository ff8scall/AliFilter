/**
 * AliFilter - AliExpress Promotions & Hot Deals Data
 * 사용자 맞춤형 알리 제휴(Portals) 프로모션 코드 및 추천 핫딜 데이터
 * 
 * [수정 안내]
 * - 새 쿠폰이나 핫딜을 추가/수정하려면 아래 객체의 내용을 변경하시면 됩니다.
 * - 본인의 제휴 링크(Tracking Link)는 알리 포털(portals.aliexpress.com) > Tools > Link Generator에서
 *   상품 URL을 변환하여 'link' 항목에 입력하시면 됩니다.
 */

window.__ALI_PROMOTIONS__ = {
  // 제휴 기본 정보
  meta: {
    trackingId: 'alifilter',
    updatedAt: '2026-10',
    titleKo: '10월 알리 특별 프로모션 & 검증 핫딜',
    titleEn: 'AliExpress Monthly Deals & Promo Codes'
  },

  // 1. 알리익스프레스 공식 프로모션 코드 모음
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

  // 2. AliFilter 검증 5성급 추천 핫딜 (평점 4.8 이상, 대량 판매 검증 제품)
  hotdeals: [
    {
      id: 'deal_1',
      titleKo: 'Baseus 65W GaN5 Pro 초고속 멀티 충전기',
      titleEn: 'Baseus 65W GaN5 Pro Fast Charger',
      tagKo: '★ 4.9 베스트셀러',
      tagEn: '★ 4.9 Best Seller',
      originalPrice: '₩38,000',
      salePrice: '₩19,200',
      discount: '49% OFF',
      rating: '4.9',
      orders: '24,000+',
      // 사용자 발급 제휴 딥링크 (AliExpress Portals 연동)
      link: 'https://s.click.aliexpress.com/e/_c3OgBvzx'
    },
    {
      id: 'deal_2',
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
      id: 'deal_3',
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
    }
  ]
};
