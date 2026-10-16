/**
 * AliFilter - AliExpress Strict Keyword & Price Filter
 * Chrome Extension Manifest V3 Content Script
 * Linear / Raycast / Apple Aesthetic Edition (Zero Emoji Clutter)
 */

(() => {
  if (window.__ALI_FILTER_INITIALIZED__) return;
  window.__ALI_FILTER_INITIALIZED__ = true;

  const STOPWORDS = new Set([
    '가성비', '좋은', '추천', '최고', '인기', '핫딜', '신상', '모음', '세트', '국내', '당일',
    'best', 'good', 'top', 'new', 'hot', 'recommend', 'deal', 'cheap', 'set'
  ]);

  // Global Settings
  let settings = {
    enabled: true,
    mode: 'hide', // 'hide' | 'dim' | 'highlight-only'
    matchCondition: 'AND', // 'AND' | 'OR'
    highlightColor: '#ffd60a',
    hideAds: true,
    showFloatingBar: true,
    showMatchBadge: true,
    minimized: true,
    pinned: false
  };

  let keywords = []; // [{ id, text, active, custom, isStopword }]
  let negativeKeywords = []; // ['케이스', '스트랩', ...]
  let priceFilter = {
    min: null,
    max: null
  };
  let minSales = null; // null | 50 | 100 | 500 | 1000
  let minRating = null; // null | 4.5 | 4.7 | 4.8
  let detectedCurrency = 'KRW';
  let savedWidgetPosition = null;
  let currentLang = 'ko'; // 'ko' | 'en'
  let hasSeenGuide = false;
  let currentTab = 'filters'; // 'filters' | 'deals'

  const I18N = {
    ko: {
      mustKw: '필수 키워드',
      clickOnOff: '클릭 시 On/Off',
      noKw: '감지된 검색어 없음',
      addKwPlaceholder: '새 필수 키워드 추가...',
      addBtn: '추가',
      excludeKw: '제외(부정) 키워드',
      cutIfMatched: '포함 시 즉시 컷',
      quickRecommend: '빠른 추천:',
      quickCase: '+ 케이스',
      quickStrap: '+ 스트랩',
      quickFilm: '+ 보호필름',
      quickParts: '+ 부품',
      addNegPlaceholder: '제외할 단어 입력...',
      addNegBtn: '제외 추가',
      noNegKw: '등록된 제외 단어 없음',
      trustTitle: '판매량 & 평점',
      trustHint: '기준 미달 차단',
      salesLabel: '최소 누적 판매량',
      ratingLabel: '최소 평점 (별점)',
      all: '전체',
      priceTitle: '가격 범위',
      currHintKrw: '통화 감지됨: 원(₩)',
      currHintUsd: '통화 감지됨: 달러($)',
      minPrice: '최소',
      maxPrice: '최대',
      apply: '적용',
      reset: '초기화',
      unmatchedTitle: '미일치 상품 처리',
      modeHide: '숨김',
      modeDim: '흐리게',
      modeHighlight: '강조만',
      checkAnd: '모든 키워드 일치 필수 (AND)',
      checkAds: '광고 / 스폰서 상품 차단',
      matchedCount: '일치',
      totalCount: '전체',
      rescan: '재스캔',
      pinTooltip: '패널 화면 고정',
      powerTooltip: '필터 활성화/비활성화',
      collapseTooltip: '패널 접기',
      langTooltip: '언어 전환 (KO / EN)',
      helpTooltip: '도움말 가이드',
      helpTitle: 'AliFilter 사용 가이드',
      helpSubtitle: '원하는 상품만 정확하게 골라내는 5가지 팁',
      helpItem1Title: '필수 키워드 (Must Keywords)',
      helpItem1Desc: '검색어 단어 칩을 켜고 꺼서 본체/핵심 부품만 통과시킵니다.',
      helpItem2Title: '제외 키워드 (Exclude Keywords)',
      helpItem2Desc: '케이스, 스트랩 등 원치 않는 악세서리 낚시 상품을 즉시 차단합니다.',
      helpItem3Title: '판매량 & 평점 필터',
      helpItem3Desc: '최소 판매량(100+) 및 평점(★ 4.7+) 미달 저품질 상품을 걸러냅니다.',
      helpItem4Title: '가격대 & 통화 자동 감지',
      helpItem4Desc: '달러($)와 원화(₩)를 자동 감지하며, 낚시성 초저가 옵션을 컷오프합니다.',
      helpItem5Title: '단축키 & 자유로운 이동',
      helpItem5Desc: 'Alt+F로 즉시 On/Off 할 수 있고, 상단 바를 드래그해 어디든 이동 가능합니다.',
      helpCloseBtn: '시작하기',
      toastLangSwitched: '언어가 한국어로 변경되었습니다',
      stopwordTag: '수식어',
      pinnedToast: '패널이 화면에 고정되었습니다',
      unpinnedToast: '패널 고정 해제됨',
      posResetToast: '위치가 기본 안전 영역으로 초기화되었습니다',
      priceResetToast: '가격 필터 초기화됨',
      tabFilter: '정밀 필터',
      tabDeals: '혜택 & 핫딜',
      couponsSecTitle: '알리 공식 프로모션 코드',
      couponsSecHint: '결제 시 코드 입력 할인',
      copyCodeBtn: '복사',
      copiedToast: '할인 코드가 복사되었습니다!',
      hotdealsSecTitle: 'AliFilter 검증 5성급 핫딜',
      hotdealsSecHint: '평점 4.8+ 가성비 검증',
      viewDealBtn: '특가 보러가기',
      affiliateNotice: '안내: 제휴 링크 경유 시 구매 금액에 따라 AliFilter 개발자에게 소정의 커미션이 지급될 수 있습니다.'
    },
    en: {
      mustKw: 'Must Keywords',
      clickOnOff: 'Click to Toggle',
      noKw: 'No search keywords found',
      addKwPlaceholder: 'Add must keyword...',
      addBtn: 'Add',
      excludeKw: 'Exclude Keywords',
      cutIfMatched: 'Cut if matched',
      quickRecommend: 'Quick:',
      quickCase: '+ Case',
      quickStrap: '+ Strap',
      quickFilm: '+ Film',
      quickParts: '+ Parts',
      addNegPlaceholder: 'Exclude keyword...',
      addNegBtn: 'Exclude',
      noNegKw: 'No exclude keywords registered',
      trustTitle: 'Sales & Rating',
      trustHint: 'Filter low quality',
      salesLabel: 'Minimum Sales',
      ratingLabel: 'Minimum Rating',
      all: 'All',
      priceTitle: 'Price Range',
      currHintKrw: 'Detected: KRW (₩)',
      currHintUsd: 'Detected: USD ($)',
      minPrice: 'Min',
      maxPrice: 'Max',
      apply: 'Apply',
      reset: 'Reset',
      unmatchedTitle: 'Unmatched Items',
      modeHide: 'Hide',
      modeDim: 'Dim',
      modeHighlight: 'Highlight',
      checkAnd: 'Match all keywords (AND)',
      checkAds: 'Block sponsored ads',
      matchedCount: 'Matched',
      totalCount: 'Total',
      rescan: 'Rescan',
      pinTooltip: 'Pin panel to screen',
      powerTooltip: 'Toggle Filter On/Off',
      collapseTooltip: 'Collapse panel',
      langTooltip: 'Switch Language (KO / EN)',
      helpTooltip: 'Help & Guide',
      helpTitle: 'AliFilter Quick Guide',
      helpSubtitle: '5 tips to filter and find exactly what you want',
      helpItem1Title: 'Must Keywords',
      helpItem1Desc: 'Toggle keyword chips on/off to keep only genuine main products.',
      helpItem2Title: 'Exclude Keywords',
      helpItem2Desc: 'Block unwanted accessories like cases, straps, and screen films.',
      helpItem3Title: 'Sales & Rating Filter',
      helpItem3Desc: 'Filter out low-quality products below sales (100+) or rating (★ 4.7+).',
      helpItem4Title: 'Price Range & Auto-Currency',
      helpItem4Desc: 'Auto-detects USD/KRW to cut off deceptive cheap bait options easily.',
      helpItem5Title: 'Shortcuts & Reposition',
      helpItem5Desc: 'Press Alt+F to toggle instantly. Drag the top header to move anywhere.',
      helpCloseBtn: 'Got it',
      toastLangSwitched: 'Language switched to English',
      stopwordTag: 'Modifier',
      pinnedToast: 'Panel pinned to screen',
      unpinnedToast: 'Panel unpinned',
      posResetToast: 'Panel reset to default safe position',
      priceResetToast: 'Price filter reset',
      tabFilter: 'Filters',
      tabDeals: 'Deals & Coupons',
      couponsSecTitle: 'Official Promo Codes',
      couponsSecHint: 'Enter code at checkout',
      copyCodeBtn: 'Copy',
      copiedToast: 'Promo code copied to clipboard!',
      hotdealsSecTitle: 'Verified 5-Star Hot Deals',
      hotdealsSecHint: 'Rating 4.8+ Top Value',
      viewDealBtn: 'View Deal',
      affiliateNotice: 'Notice: Purchasing via affiliate links supports AliFilter development at no extra cost.'
    }
  };

  function t(key) {
    const dict = I18N[currentLang] || I18N.ko;
    return dict[key] || key;
  }

  let debounceTimer = null;
  let lastProcessedUrl = '';

  let currentStats = {
    total: 0,
    matched: 0,
    hidden: 0,
    ads: 0
  };

  /**
   * 1. Flexible Pattern Generator
   */
  function buildFlexiblePattern(word) {
    if (!word) return '';
    let escaped = word.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let flexible = escaped.replace(/[\s\-_]+/g, '[\\s\\-_]*');
    flexible = flexible.replace(/(\d+)([a-zA-Z]+)/g, '$1[\\s\\-_]*$2');
    return flexible;
  }

  function testKeywordMatch(titleText, keywordText) {
    if (!titleText || !keywordText) return false;
    const pattern = buildFlexiblePattern(keywordText);
    try {
      const reg = new RegExp(pattern, 'i');
      return reg.test(titleText);
    } catch (e) {
      return titleText.toLowerCase().includes(keywordText.toLowerCase());
    }
  }

  const COMMON_NEG_ALIASES = {
    '케이스': ['케이스', 'case', 'cover', 'housing', 'shell'],
    'case': ['case', 'cover', 'housing', 'shell', '케이스'],
    '스트랩': ['스트랩', 'strap', 'lanyard', 'band', '줄'],
    'strap': ['strap', 'lanyard', 'band', '스트랩'],
    '보호필름': ['보호필름', '필름', 'film', 'protector', 'tempered glass', '액정보호'],
    '필름': ['보호필름', '필름', 'film', 'protector', 'tempered glass'],
    'film': ['film', 'protector', 'tempered glass', '보호필름', '필름'],
    '부품': ['부품', 'parts', 'accessory', 'accessories', 'spare', 'screw', 'bolt', 'nut'],
    '악세서리': ['부품', 'parts', 'accessory', 'accessories', '악세서리']
  };

  function testNegativeMatch(titleText, negWord) {
    if (!titleText || !negWord) return false;
    const lower = negWord.toLowerCase().trim();
    const aliases = COMMON_NEG_ALIASES[lower] || [negWord];
    return aliases.some(alias => testKeywordMatch(titleText, alias));
  }

  /**
   * 2. Price Parsing Helper
   */
  function parsePrice(text) {
    if (!text) return null;
    const isUsd = text.includes('$') || text.includes('USD') || text.includes('US');
    const cleaned = text.replace(/,/g, '');
    const match = cleaned.match(/\d+(\.\d+)?/);
    if (!match) return null;
    return { val: parseFloat(match[0]), isUsd };
  }

  function getCardPrice(card) {
    const priceSelectors = [
      'div[class*="multi--price-sale--"]',
      'div[class*="price--current--"]',
      'div[class*="price--"]',
      'span[class*="price"]',
      'div[class*="price"]',
      '.price'
    ];
    for (const sel of priceSelectors) {
      const el = card.querySelector(sel);
      if (el) {
        const parsed = parsePrice(el.textContent);
        if (parsed && !isNaN(parsed.val)) {
          return parsed;
        }
      }
    }
    return null;
  }

  /**
   * 2-1. Sales Parsing Helper
   */
  function parseSales(text) {
    if (!text) return null;
    const cleaned = text.trim().toLowerCase().replace(/,/g, '');

    // 만 단위: 1.2만+ 판매, 1만 누적 판매
    const manMatch = cleaned.match(/([\d\.]+)\s*만\s*\+?\s*(?:개?\s*(?:판매|누적|구매)|sold)?/);
    if (manMatch) {
      return Math.round(parseFloat(manMatch[1]) * 10000);
    }

    // k 단위: 1.5k+ sold, 10k orders
    const kMatch = cleaned.match(/([\d\.]+)\s*k\s*\+?\s*(?:sold|orders|sales)?/);
    if (kMatch) {
      return Math.round(parseFloat(kMatch[1]) * 1000);
    }

    // 일반 숫자 단위: 1200+ sold, 450개 판매됨, 100+ 누적 판매, 42 sold
    const numMatch = cleaned.match(/(\d+)\s*\+?\s*(?:개?\s*(?:판매|누적|구매)|sold|orders|sales)/);
    if (numMatch) {
      return parseInt(numMatch[1], 10);
    }

    return null;
  }

  function getCardSales(card) {
    const salesSelectors = [
      'span[class*="trade--"]',
      'div[class*="trade--"]',
      'span[class*="sale--"]',
      'div[class*="sale--"]',
      'span[class*="order--"]',
      '.sales-count',
      '.orders-count',
      '.trade'
    ];
    for (const sel of salesSelectors) {
      const el = card.querySelector(sel);
      if (el) {
        const val = parseSales(el.textContent);
        if (val !== null) return val;
      }
    }
    return parseSales(card.textContent);
  }

  /**
   * 2-2. Rating Parsing Helper
   */
  function parseRating(text) {
    if (!text) return null;
    const match = text.match(/(?:★|별점|rating|stars?)?\s*([3-5]\.\d)/i);
    if (match) {
      const score = parseFloat(match[1]);
      if (score >= 1.0 && score <= 5.0) return score;
    }
    return null;
  }

  function getCardRating(card) {
    const ratingSelectors = [
      'span[class*="star--"]',
      'span[class*="evaluation--"]',
      'span[class*="rating--"]',
      'div[class*="rating--"]',
      '.star-score',
      '.rating-score',
      '.star'
    ];
    for (const sel of ratingSelectors) {
      const el = card.querySelector(sel);
      if (el) {
        const val = parseRating(el.textContent);
        if (val !== null) return val;
      }
    }
    return parseRating(card.textContent);
  }

  /**
   * 3. Initialize Extension
   */
  async function init() {
    try {
      const stored = await chrome.storage.local.get({
        ...settings,
        widgetPosition: null,
        negativeKeywords: [],
        minSales: null,
        minRating: null,
        lang: null,
        hasSeenGuide: false
      });
      settings = { ...settings, ...stored };
      hasSeenGuide = !!stored.hasSeenGuide;
      if (stored.widgetPosition && typeof stored.widgetPosition.top === 'number') {
        savedWidgetPosition = stored.widgetPosition;
      }
      if (Array.isArray(stored.negativeKeywords)) {
        negativeKeywords = stored.negativeKeywords;
      }
      if (stored.minSales !== undefined) minSales = stored.minSales;
      if (stored.minRating !== undefined) minRating = stored.minRating;
      const detectedBrowserLang = (navigator.language && navigator.language.toLowerCase().startsWith('ko')) ? 'ko' : 'en';
      currentLang = stored.lang || detectedBrowserLang;
    } catch (e) {
      console.warn('[AliFilter] Could not load storage:', e);
    }

    extractKeywords();

    if (settings.showFloatingBar) {
      ensureFloatingWidget();
    }

    registerKeyboardShortcuts();
    processAllCards();
    observeDomChanges();
    observeUrlChanges();

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'SETTINGS_UPDATED') {
        settings = { ...settings, ...message.settings };
        if (settings.showFloatingBar) {
          ensureFloatingWidget();
          updateWidgetUI();
        } else {
          removeFloatingWidget();
        }
        processAllCards();
      }
    });
  }

  /**
   * 4. Extract Keywords
   */
  function extractKeywords() {
    const url = window.location.href;
    lastProcessedUrl = url;
    let rawQuery = '';

    try {
      const urlObj = new URL(url);
      rawQuery = urlObj.searchParams.get('SearchText') ||
                 urlObj.searchParams.get('searchText') ||
                 urlObj.searchParams.get('searchTerm') ||
                 urlObj.searchParams.get('keywords') || '';

      if (!rawQuery && urlObj.pathname.includes('/wholesale-')) {
        const match = urlObj.pathname.match(/\/wholesale-([^/]+)\.html/);
        if (match && match[1]) {
          rawQuery = decodeURIComponent(match[1]).replace(/-/g, ' ');
        }
      }
    } catch (e) {}

    if (!rawQuery) {
      const searchInput = document.querySelector('input.search-key-box, input.search-words-input, input#search-words, input[name="SearchText"]');
      if (searchInput && searchInput.value) {
        rawQuery = searchInput.value;
      }
    }

    if (rawQuery) {
      const words = rawQuery
        .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ\.\-\+]/g, ' ')
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length > 0 && w !== '+' && w !== '-');

      const uniqueWords = [];
      const seen = new Set();
      for (const w of words) {
        const lower = w.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          uniqueWords.push(w);
        }
      }

      const customKws = keywords.filter(k => k.custom);

      keywords = [
        ...uniqueWords.map((word, idx) => {
          const isStop = STOPWORDS.has(word.toLowerCase());
          return {
            id: `auto_${idx}_${word}`,
            text: word,
            active: !isStop,
            isStopword: isStop,
            custom: false
          };
        }),
        ...customKws
      ];
    }
  }

  function findProductCards() {
    const cardSet = new Set();
    const knownSelectors = [
      'div[class*="multi--content--"]',
      'div[class*="search-card-item"]',
      'div[class*="item--card--"]',
      'div[class*="list--gallery--"] > div',
      'div[class*="search-item"]',
      'div.product-snippet',
      'div[class*="gallery--grid--"] > div'
    ];

    for (const sel of knownSelectors) {
      document.querySelectorAll(sel).forEach(el => {
        if (el.querySelector('a[href*="/item/"]') || el.querySelector('a[href*="item.html"]')) {
          cardSet.add(el);
        }
      });
    }

    const itemLinks = document.querySelectorAll('a[href*="/item/"], a[href*="item.html"]');
    itemLinks.forEach(a => {
      let card = a.closest('div[class*="multi--content--"], div[class*="search-card"], div[class*="item--card"], div[class*="list--gallery--"] > div, div[class*="search-item"], .product-snippet');
      if (!card) {
        let parent = a.parentElement;
        let depth = 0;
        while (parent && depth < 5 && parent.tagName !== 'BODY' && parent.tagName !== 'MAIN') {
          if (parent.querySelector('img') && (parent.querySelector('[class*="title"]') || parent.querySelector('h1, h3'))) {
            card = parent;
            break;
          }
          parent = parent.parentElement;
          depth++;
        }
      }
      if (card) cardSet.add(card);
    });

    return Array.from(cardSet);
  }

  function getCardTitleElement(card) {
    const titleSelectors = [
      'h1[class*="title"]',
      'h3[class*="title"]',
      'div[class*="multi--titleText--"]',
      'div[class*="title--"]',
      'h3',
      'h1',
      'a[title]',
      'a[href*="/item/"]'
    ];
    for (const sel of titleSelectors) {
      const el = card.querySelector(sel);
      if (el && el.textContent.trim().length > 5) return el;
    }
    return null;
  }

  function isAdCard(card) {
    const adSelectors = ['[class*="ad--"]', '[class*="sponsored--"]', '[class*="recommend--ad"]'];
    for (const sel of adSelectors) {
      if (card.querySelector(sel)) return true;
    }
    const allTextEls = card.querySelectorAll('span, div, em, b');
    for (const el of allTextEls) {
      const txt = el.textContent.trim();
      if (txt === 'Ad' || txt === 'AD' || txt === 'Sponsored' || txt === '광고') return true;
    }
    return false;
  }

  function highlightTextNodes(element, activeWords) {
    if (!element || activeWords.length === 0) return;

    if (!element.dataset.aliOriginalHtml) {
      element.dataset.aliOriginalHtml = element.innerHTML;
    } else {
      element.innerHTML = element.dataset.aliOriginalHtml;
    }

    const patterns = activeWords.map(w => buildFlexiblePattern(w)).filter(Boolean);
    if (patterns.length === 0) return;
    const regex = new RegExp(`(${patterns.join('|')})`, 'gi');

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.parentElement && currentNode.parentElement.tagName !== 'MARK') {
        textNodes.push(currentNode);
      }
    }

    textNodes.forEach(node => {
      const text = node.nodeValue;
      if (regex.test(text)) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        text.replace(regex, (match, p1, offset) => {
          if (offset > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, offset)));
          }
          const mark = document.createElement('mark');
          mark.className = 'ali-filter-mark';
          mark.textContent = match;
          fragment.appendChild(mark);
          lastIndex = offset + match.length;
        });

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  function restoreTitleHtml(element) {
    if (element && element.dataset.aliOriginalHtml) {
      element.innerHTML = element.dataset.aliOriginalHtml;
    }
  }

  /**
   * 5. Process Cards
   */
  function processAllCards() {
    const cards = findProductCards();
    const activeKws = keywords.filter(k => k.active).map(k => k.text.trim());

    let stats = {
      total: cards.length,
      matched: 0,
      hidden: 0,
      ads: 0
    };

    let usdCount = 0;
    let krwCount = 0;

    cards.forEach(card => {
      const isAd = isAdCard(card);
      if (isAd) stats.ads++;

      const titleEl = getCardTitleElement(card);
      const titleText = (titleEl ? (titleEl.dataset.aliOriginalHtml ? titleEl.textContent : titleEl.textContent) : '');

      const cardPriceObj = getCardPrice(card);
      if (cardPriceObj) {
        if (cardPriceObj.isUsd) usdCount++;
        else krwCount++;
      }

      if (!settings.enabled) {
        card.classList.remove('ali-card-hidden', 'ali-card-dimmed', 'ali-card-matched');
        removeCardBadge(card);
        if (titleEl) restoreTitleHtml(titleEl);
        stats.matched++;
        return;
      }

      if (isAd && settings.hideAds) {
        applyCardAction(card, false, '광고 제외');
        stats.hidden++;
        if (titleEl) restoreTitleHtml(titleEl);
        return;
      }

      // Negative (Exclude) Keywords Filter
      if (negativeKeywords.length > 0) {
        const matchedNegKw = negativeKeywords.find(neg => testNegativeMatch(titleText, neg));
        if (matchedNegKw) {
          stats.hidden++;
          card.classList.remove('ali-card-matched');
          applyCardAction(card, false, `제외: ${matchedNegKw}`);
          if (titleEl) restoreTitleHtml(titleEl);
          return;
        }
      }

      let isPriceMatch = true;
      let priceFailReason = '';

      if (cardPriceObj) {
        if (priceFilter.min !== null && cardPriceObj.val < priceFilter.min) {
          isPriceMatch = false;
          priceFailReason = '낚시 옵션 제외';
        } else if (priceFilter.max !== null && cardPriceObj.val > priceFilter.max) {
          isPriceMatch = false;
          priceFailReason = '예산 초과';
        }
      }

      if (!isPriceMatch) {
        stats.hidden++;
        card.classList.remove('ali-card-matched');
        applyCardAction(card, false, priceFailReason);
        if (titleEl) restoreTitleHtml(titleEl);
        return;
      }

      // Sales Filter
      if (minSales !== null) {
        const sales = getCardSales(card);
        if (sales === null || sales < minSales) {
          stats.hidden++;
          card.classList.remove('ali-card-matched');
          applyCardAction(card, false, `판매량 미달: ${sales !== null ? sales.toLocaleString() + '개' : '0개'}`);
          if (titleEl) restoreTitleHtml(titleEl);
          return;
        }
      }

      // Rating Filter
      if (minRating !== null) {
        const rating = getCardRating(card);
        if (rating === null || rating < minRating) {
          stats.hidden++;
          card.classList.remove('ali-card-matched');
          applyCardAction(card, false, `평점 미달: ${rating !== null ? rating + '★' : '평점없음'}`);
          if (titleEl) restoreTitleHtml(titleEl);
          return;
        }
      }

      if (activeKws.length === 0) {
        card.classList.remove('ali-card-hidden', 'ali-card-dimmed');
        card.classList.add('ali-card-matched');
        removeCardBadge(card);
        if (titleEl) restoreTitleHtml(titleEl);
        stats.matched++;
        return;
      }

      const matchedKws = [];
      const missingKws = [];

      activeKws.forEach(kw => {
        if (testKeywordMatch(titleText, kw)) {
          matchedKws.push(kw);
        } else {
          missingKws.push(kw);
        }
      });

      let isKwMatch = false;
      if (settings.matchCondition === 'AND') {
        isKwMatch = (missingKws.length === 0);
      } else {
        isKwMatch = (matchedKws.length > 0);
      }

      if (isKwMatch) {
        stats.matched++;
        card.classList.remove('ali-card-hidden', 'ali-card-dimmed');
        card.classList.add('ali-card-matched');

        if (titleEl) {
          highlightTextNodes(titleEl, matchedKws);
        }

        if (settings.showMatchBadge) {
          setCardBadge(card, true, `${matchedKws.length}/${activeKws.length} 일치`);
        } else {
          removeCardBadge(card);
        }
      } else {
        stats.hidden++;
        card.classList.remove('ali-card-matched');

        const badgeMsg = missingKws.length > 0 ? `${missingKws[0]} 누락` : '불일치';
        applyCardAction(card, false, badgeMsg);

        if (titleEl) {
          if (matchedKws.length > 0) {
            highlightTextNodes(titleEl, matchedKws);
          } else {
            restoreTitleHtml(titleEl);
          }
        }
      }
    });

    if (usdCount > 0 || krwCount > 0) {
      detectedCurrency = (usdCount >= krwCount) ? 'USD' : 'KRW';
    }

    currentStats = stats;
    updateWidgetUI();
  }

  function applyCardAction(card, isMatch, reason) {
    if (isMatch) {
      card.classList.remove('ali-card-hidden', 'ali-card-dimmed');
    } else {
      if (settings.mode === 'hide') {
        card.classList.add('ali-card-hidden');
        card.classList.remove('ali-card-dimmed');
      } else if (settings.mode === 'dim') {
        card.classList.remove('ali-card-hidden');
        card.classList.add('ali-card-dimmed');
      } else {
        card.classList.remove('ali-card-hidden', 'ali-card-dimmed');
      }

      if (settings.showMatchBadge && settings.mode !== 'hide') {
        setCardBadge(card, false, reason);
      } else {
        removeCardBadge(card);
      }
    }
  }

  function setCardBadge(card, isPass, text) {
    let badge = card.querySelector('.ali-card-badge');
    if (!badge) {
      badge = document.createElement('div');
      card.appendChild(badge);
    }
    badge.className = `ali-card-badge ${isPass ? 'ali-badge-pass' : 'ali-badge-fail'}`;
    badge.textContent = text;
  }

  function removeCardBadge(card) {
    const badge = card.querySelector('.ali-card-badge');
    if (badge) badge.remove();
  }

  function showToast(message) {
    let toast = document.getElementById('ali-filter-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ali-filter-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 1500);
  }

  function registerKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        toggleMasterPower();
      }
    });
  }

  function toggleMasterPower() {
    settings.enabled = !settings.enabled;
    chrome.storage.local.set({ enabled: settings.enabled });
    showToast(settings.enabled ? `필터 활성화 (${currentStats.matched}개 일치)` : '필터 비활성화 (전체 표시)');
    updateWidgetUI();
    processAllCards();
  }

  /**
   * 6. High-End Floating Widget UI (Zero Emoji)
   */
  function ensureFloatingWidget() {
    let widget = document.getElementById('ali-filter-widget');
    if (widget) return;

    widget = document.createElement('div');
    widget.id = 'ali-filter-widget';

    if (savedWidgetPosition) {
      widget.style.top = `${savedWidgetPosition.top}px`;
      widget.style.left = `${savedWidgetPosition.left}px`;
      widget.style.right = 'auto';
    } else {
      widget.style.top = '130px';
      widget.style.right = '24px';
      widget.style.left = 'auto';
    }

    if (settings.minimized) {
      widget.classList.add('compact-mode');
    }

    widget.innerHTML = `
      <!-- Ultra-Sleek Dynamic Island Style Pill Bar -->
      <div class="ali-smart-pill" id="aliSmartPill">
        <div class="ali-pill-left">
          <svg class="ali-pill-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span class="ali-pill-title">AliFilter</span>
          <span class="ali-pill-sep">/</span>
          <span class="ali-pill-stat" id="aliPillStat"><strong>0</strong>/0</span>
          <span class="ali-pill-price-badge" id="aliPillPriceTag" style="display:none;"></span>
        </div>
        <svg class="ali-pill-chevron-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      <!-- Linear / Raycast Style Control Panel -->
      <div class="ali-widget-panel" id="aliWidgetPanel">
        <!-- Header -->
        <div class="ali-panel-header">
          <div class="ali-header-left">
            <div class="ali-header-logo-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </div>
            <span class="ali-header-brand-title">AliFilter</span>
            <span class="ali-header-kbd">Alt+F</span>
          </div>
          <div class="ali-header-actions">
            <button type="button" class="ali-lang-btn" id="aliLangBtn" title="${t('langTooltip')}">${currentLang.toUpperCase()}</button>
            <button type="button" class="ali-icon-btn" id="aliHelpBtn" title="${t('helpTooltip')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </button>
            <button type="button" class="ali-icon-btn ${settings.pinned ? 'active' : ''}" id="aliPinBtn" title="${t('pinTooltip')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 17v5"></path>
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>
              </svg>
            </button>
            <button type="button" class="ali-icon-btn ${settings.enabled ? 'active' : ''}" id="aliTogglePower" title="${t('powerTooltip')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
            </button>
            <button type="button" class="ali-icon-btn" id="aliCollapseBtn" title="${t('collapseTooltip')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Sub-Tabs -->
        <div class="ali-panel-nav">
          <button type="button" class="ali-nav-tab ${currentTab === 'filters' ? 'active' : ''}" id="aliNavTabFilters" data-tab="filters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span id="aliNavTabFiltersText">${t('tabFilter')}</span>
          </button>
          <button type="button" class="ali-nav-tab ${currentTab === 'deals' ? 'active' : ''}" id="aliNavTabDeals" data-tab="deals">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span id="aliNavTabDealsText">${t('tabDeals')}</span>
            <span class="ali-nav-badge">HOT</span>
          </button>
        </div>

        <!-- 1. Filters Tab View -->
        <div class="ali-tab-view ${currentTab === 'filters' ? '' : 'ali-tab-hidden'}" id="aliViewFilters">
          <!-- Body -->
          <div class="ali-panel-body">
            <!-- 1. Keywords Section -->
            <div>
              <div class="ali-sec-header">
                <span class="ali-sec-title">${t('mustKw')}</span>
                <span class="ali-sec-info">${t('clickOnOff')}</span>
              </div>
              <div class="ali-chips-wrap" id="aliChipsWrap"></div>
              <div class="ali-add-keyword-row">
                <input type="text" class="ali-compact-input" id="aliAddKwInput" placeholder="${t('addKwPlaceholder')}" />
                <button type="button" class="ali-compact-btn" id="aliAddKwBtn">${t('addBtn')}</button>
              </div>
            </div>

            <!-- 1-2. Negative Keywords Section -->
            <div>
              <div class="ali-sec-header">
                <span class="ali-sec-title" style="color: #f87171;">${t('excludeKw')}</span>
                <span class="ali-sec-info">${t('cutIfMatched')}</span>
              </div>
              <div class="ali-chips-wrap ali-neg-wrap" id="aliNegChipsWrap"></div>
              <div class="ali-neg-quick-row">
                <span class="ali-quick-label">${t('quickRecommend')}</span>
                <button type="button" class="ali-quick-neg-chip" data-word="케이스">${t('quickCase')}</button>
                <button type="button" class="ali-quick-neg-chip" data-word="스트랩">${t('quickStrap')}</button>
                <button type="button" class="ali-quick-neg-chip" data-word="보호필름">${t('quickFilm')}</button>
                <button type="button" class="ali-quick-neg-chip" data-word="부품">${t('quickParts')}</button>
              </div>
              <div class="ali-add-keyword-row">
                <input type="text" class="ali-compact-input" id="aliAddNegInput" placeholder="${t('addNegPlaceholder')}" />
                <button type="button" class="ali-compact-btn danger" id="aliAddNegBtn">${t('addNegBtn')}</button>
              </div>
            </div>

            <!-- 1-3. Trust Filter (Sales & Rating) Section -->
            <div class="ali-trust-section">
              <div class="ali-sec-header">
                <span class="ali-sec-title">${t('trustTitle')}</span>
                <span class="ali-sec-info">${t('trustHint')}</span>
              </div>
              <div class="ali-trust-item">
                <span class="ali-trust-label">${t('salesLabel')}</span>
                <div class="ali-filter-pill-group" id="aliSalesPillGroup">
                  <button type="button" class="ali-preset-pill ${minSales === null ? 'active' : ''}" data-sales="">${t('all')}</button>
                  <button type="button" class="ali-preset-pill ${minSales === 50 ? 'active' : ''}" data-sales="50">${currentLang === 'ko' ? '50+개' : '50+'}</button>
                  <button type="button" class="ali-preset-pill ${minSales === 100 ? 'active' : ''}" data-sales="100">${currentLang === 'ko' ? '100+개' : '100+'}</button>
                  <button type="button" class="ali-preset-pill ${minSales === 500 ? 'active' : ''}" data-sales="500">${currentLang === 'ko' ? '500+개' : '500+'}</button>
                  <button type="button" class="ali-preset-pill ${minSales === 1000 ? 'active' : ''}" data-sales="1000">${currentLang === 'ko' ? '1천+개' : '1k+'}</button>
                </div>
              </div>
              <div class="ali-trust-item" style="margin-top: 6px;">
                <span class="ali-trust-label">${t('ratingLabel')}</span>
                <div class="ali-filter-pill-group" id="aliRatingPillGroup">
                  <button type="button" class="ali-preset-pill ${minRating === null ? 'active' : ''}" data-rating="">${t('all')}</button>
                  <button type="button" class="ali-preset-pill ${minRating === 4.5 ? 'active' : ''}" data-rating="4.5">★ 4.5+</button>
                  <button type="button" class="ali-preset-pill ${minRating === 4.7 ? 'active' : ''}" data-rating="4.7">★ 4.7+</button>
                  <button type="button" class="ali-preset-pill ${minRating === 4.8 ? 'active' : ''}" data-rating="4.8">★ 4.8+</button>
                </div>
              </div>
            </div>

            <!-- 2. Price Filter Section -->
            <div class="ali-price-section">
              <div class="ali-sec-header">
                <span class="ali-sec-title">${t('priceTitle')}</span>
                <span class="ali-sec-info" id="aliPriceHint">${detectedCurrency === 'USD' ? t('currHintUsd') : t('currHintKrw')}</span>
              </div>
              <!-- Direct Input -->
              <div class="ali-price-input-row">
                <div class="ali-input-group">
                  <span class="ali-input-symbol" id="aliMinSymbol">₩</span>
                  <input type="number" class="ali-bare-input" id="aliPriceMin" placeholder="${t('minPrice')}" min="0" />
                </div>
                <span class="ali-range-dash">–</span>
                <div class="ali-input-group">
                  <span class="ali-input-symbol" id="aliMaxSymbol">₩</span>
                  <input type="number" class="ali-bare-input" id="aliPriceMax" placeholder="${t('maxPrice')}" min="0" />
                </div>
                <button type="button" class="ali-compact-btn" id="aliPriceApplyBtn">${t('apply')}</button>
              </div>
              <!-- Presets -->
              <div class="ali-price-presets-wrap"></div>
            </div>

            <!-- 3. Mode Tabs -->
            <div>
              <div class="ali-sec-header">
                <span class="ali-sec-title">${t('unmatchedTitle')}</span>
              </div>
              <div class="ali-segmented-tabs">
                <button type="button" class="ali-tab-btn ${settings.mode === 'hide' ? 'active' : ''}" data-mode="hide">${t('modeHide')}</button>
                <button type="button" class="ali-tab-btn ${settings.mode === 'dim' ? 'active' : ''}" data-mode="dim">${t('modeDim')}</button>
                <button type="button" class="ali-tab-btn ${settings.mode === 'highlight-only' ? 'active' : ''}" data-mode="highlight-only">${t('modeHighlight')}</button>
              </div>
            </div>

            <!-- 4. Switches -->
            <div>
              <label class="ali-switch-row">
                <span>${t('checkAnd')}</span>
                <input type="checkbox" id="aliCheckAnd" ${settings.matchCondition === 'AND' ? 'checked' : ''}>
              </label>
              <label class="ali-switch-row">
                <span>${t('checkAds')}</span>
                <input type="checkbox" id="aliCheckHideAds" ${settings.hideAds ? 'checked' : ''}>
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="ali-panel-footer">
            <div class="ali-footer-count">
              ${t('matchedCount')} <strong id="aliStatMatched">0</strong> / ${t('totalCount')} <span id="aliStatTotal">0</span>
            </div>
            <button type="button" class="ali-footer-btn" id="aliRescanBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>${t('rescan')}</span>
            </button>
          </div>
        </div>

        <!-- 2. Deals & Coupons Tab View -->
        <div class="ali-tab-view ${currentTab === 'deals' ? '' : 'ali-tab-hidden'}" id="aliViewDeals">
          <div class="ali-panel-body">
            <!-- Promo Coupons -->
            <div class="ali-deals-sec">
              <div class="ali-sec-header">
                <span class="ali-sec-title" id="aliCouponsSecTitle">${t('couponsSecTitle')}</span>
                <span class="ali-sec-info" id="aliCouponsSecHint">${t('couponsSecHint')}</span>
              </div>
              <div class="ali-coupons-list" id="aliCouponsList"></div>
            </div>

            <!-- Hot Deals -->
            <div class="ali-deals-sec" style="margin-top: 14px;">
              <div class="ali-sec-header">
                <span class="ali-sec-title" id="aliHotdealsSecTitle">${t('hotdealsSecTitle')}</span>
                <span class="ali-sec-info" id="aliHotdealsSecHint">${t('hotdealsSecHint')}</span>
              </div>
              <div class="ali-hotdeals-list" id="aliHotdealsList"></div>
            </div>

            <!-- Transparency Notice -->
            <div class="ali-deals-notice" id="aliAffiliateNotice">
              ${t('affiliateNotice')}
            </div>
          </div>
        </div>

        <!-- Help / Quick Guide Overlay Modal -->
        <div class="ali-help-overlay" id="aliHelpOverlay">
          <div class="ali-help-header">
            <div class="ali-help-title-wrap">
              <div class="ali-help-icon-box">?</div>
              <div>
                <h4 class="ali-help-title" id="aliHelpTitle">${t('helpTitle')}</h4>
                <p class="ali-help-sub" id="aliHelpSubtitle">${t('helpSubtitle')}</p>
              </div>
            </div>
            <button type="button" class="ali-help-close-x" id="aliHelpCloseX" title="닫기">&times;</button>
          </div>

          <div class="ali-help-list">
            <div class="ali-help-item">
              <div class="ali-help-num">1</div>
              <div class="ali-help-content">
                <strong id="aliHelpItem1Title">${t('helpItem1Title')}</strong>
                <span id="aliHelpItem1Desc">${t('helpItem1Desc')}</span>
              </div>
            </div>

            <div class="ali-help-item">
              <div class="ali-help-num">2</div>
              <div class="ali-help-content">
                <strong id="aliHelpItem2Title">${t('helpItem2Title')}</strong>
                <span id="aliHelpItem2Desc">${t('helpItem2Desc')}</span>
              </div>
            </div>

            <div class="ali-help-item">
              <div class="ali-help-num">3</div>
              <div class="ali-help-content">
                <strong id="aliHelpItem3Title">${t('helpItem3Title')}</strong>
                <span id="aliHelpItem3Desc">${t('helpItem3Desc')}</span>
              </div>
            </div>

            <div class="ali-help-item">
              <div class="ali-help-num">4</div>
              <div class="ali-help-content">
                <strong id="aliHelpItem4Title">${t('helpItem4Title')}</strong>
                <span id="aliHelpItem4Desc">${t('helpItem4Desc')}</span>
              </div>
            </div>

            <div class="ali-help-item">
              <div class="ali-help-num">5</div>
              <div class="ali-help-content">
                <strong id="aliHelpItem5Title">${t('helpItem5Title')}</strong>
                <span id="aliHelpItem5Desc">${t('helpItem5Desc')}</span>
              </div>
            </div>
          </div>

          <div class="ali-help-footer">
            <button type="button" class="ali-help-submit-btn" id="aliHelpConfirmBtn">${t('helpCloseBtn')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    bindWidgetEvents(widget);
  }

  function removeFloatingWidget() {
    const widget = document.getElementById('ali-filter-widget');
    if (widget) widget.remove();
  }

  function setupDraggable(widget) {
    let isDragging = false;
    let hasMoved = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const pill = widget.querySelector('#aliSmartPill');
    const header = widget.querySelector('.ali-panel-header');

    function onPointerDown(e) {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.ali-chip') || e.target.closest('a')) {
        return;
      }

      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = widget.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasMoved && Math.hypot(dx, dy) > 4) {
        hasMoved = true;
        document.body.classList.add('ali-dragging');
      }

      if (hasMoved) {
        let nextLeft = initialLeft + dx;
        let nextTop = initialTop + dy;

        const widgetWidth = widget.offsetWidth || 160;
        const widgetHeight = widget.offsetHeight || 34;

        const maxLeft = Math.max(10, window.innerWidth - widgetWidth - 10);
        const maxTop = Math.max(10, window.innerHeight - widgetHeight - 10);

        nextLeft = Math.min(Math.max(10, nextLeft), maxLeft);
        nextTop = Math.min(Math.max(10, nextTop), maxTop);

        widget.style.left = `${nextLeft}px`;
        widget.style.top = `${nextTop}px`;
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
      }
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      document.body.classList.remove('ali-dragging');

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (hasMoved) {
        const rect = widget.getBoundingClientRect();
        const pos = { left: Math.round(rect.left), top: Math.round(rect.top) };
        savedWidgetPosition = pos;
        try {
          chrome.storage.local.set({ widgetPosition: pos });
        } catch (err) {}
      }
    }

    if (pill) {
      pill.addEventListener('pointerdown', onPointerDown);
      pill.addEventListener('click', (e) => {
        if (hasMoved) {
          e.stopPropagation();
          e.preventDefault();
          hasMoved = false;
          return;
        }
        widget.classList.remove('compact-mode');
        settings.minimized = false;
        chrome.storage.local.set({ minimized: false });
      });
    }

    if (header) {
      header.addEventListener('pointerdown', onPointerDown);
      header.setAttribute('title', '드래그하여 원하는 위치로 이동 / 더블클릭 시 기본 위치로 복귀');
      header.addEventListener('dblclick', (e) => {
        if (e.target.closest('button')) return;
        widget.style.left = 'auto';
        widget.style.right = '24px';
        widget.style.top = '130px';
        savedWidgetPosition = null;
        try {
          chrome.storage.local.remove('widgetPosition');
        } catch (err) {}
        showToast(t('posResetToast'));
      });
    }
  }

  function copyToClipboard(text, btnEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        onCopySuccess(btnEl);
      }).catch(() => fallbackCopy(text, btnEl));
    } else {
      fallbackCopy(text, btnEl);
    }
  }

  function fallbackCopy(text, btnEl) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onCopySuccess(btnEl);
    } catch (e) {
      showToast('복사 실패');
    }
    ta.remove();
  }

  function onCopySuccess(btnEl) {
    showToast(t('copiedToast'));
    if (btnEl) {
      const origHtml = btnEl.innerHTML;
      btnEl.classList.add('copied');
      btnEl.innerHTML = `<span>${currentLang === 'ko' ? '복사됨!' : 'Copied!'}</span>`;
      setTimeout(() => {
        btnEl.classList.remove('copied');
        btnEl.innerHTML = origHtml;
      }, 1400);
    }
  }

  function renderPromotionsView(widget) {
    if (!widget) widget = document.getElementById('ali-filter-widget');
    if (!widget) return;

    const data = window.__ALI_PROMOTIONS__;
    if (!data) return;

    // Coupons
    const couponsContainer = widget.querySelector('#aliCouponsList');
    if (couponsContainer && Array.isArray(data.coupons)) {
      couponsContainer.innerHTML = data.coupons.map(c => {
        const title = currentLang === 'ko' ? c.titleKo : c.titleEn;
        const desc = currentLang === 'ko' ? c.descKo : c.descEn;
        const badge = currentLang === 'ko' ? c.badge : c.badgeEn;
        return `
          <div class="ali-coupon-card" data-code="${c.code}">
            <div class="ali-coupon-top">
              <span class="ali-coupon-badge">${badge}</span>
              <span class="ali-coupon-title">${title}</span>
            </div>
            <div class="ali-coupon-bottom">
              <div class="ali-coupon-code-wrap">
                <span class="ali-coupon-code">${c.code}</span>
              </div>
              <button type="button" class="ali-coupon-copy-btn" data-code="${c.code}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>${t('copyCodeBtn')}</span>
              </button>
            </div>
            <div class="ali-coupon-desc">${desc}</div>
          </div>
        `;
      }).join('');

      couponsContainer.querySelectorAll('.ali-coupon-copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const code = btn.dataset.code;
          copyToClipboard(code, btn);
        });
      });
    }

    // Hot Deals
    const hotdealsContainer = widget.querySelector('#aliHotdealsList');
    if (hotdealsContainer && Array.isArray(data.hotdeals)) {
      hotdealsContainer.innerHTML = data.hotdeals.map(d => {
        const title = currentLang === 'ko' ? d.titleKo : d.titleEn;
        const tag = currentLang === 'ko' ? d.tagKo : d.tagEn;
        return `
          <div class="ali-deal-card">
            <div class="ali-deal-meta">
              <span class="ali-deal-tag">${tag}</span>
              <span class="ali-deal-stats">★ ${d.rating} · ${d.orders}</span>
            </div>
            <div class="ali-deal-title" title="${title}">${title}</div>
            <div class="ali-deal-price-row">
              <div class="ali-deal-price-box">
                <span class="ali-deal-sale-price">${d.salePrice}</span>
                <span class="ali-deal-orig-price">${d.originalPrice}</span>
                <span class="ali-deal-discount">${d.discount}</span>
              </div>
              <a href="${d.link}" target="_blank" rel="noopener noreferrer" class="ali-deal-action-btn">
                <span>${t('viewDealBtn')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function bindWidgetEvents(widget) {
    const pill = widget.querySelector('#aliSmartPill');
    const collapseBtn = widget.querySelector('#aliCollapseBtn');
    const pinBtn = widget.querySelector('#aliPinBtn');
    const langBtn = widget.querySelector('#aliLangBtn');
    const helpBtn = widget.querySelector('#aliHelpBtn');
    const helpOverlay = widget.querySelector('#aliHelpOverlay');
    const helpCloseX = widget.querySelector('#aliHelpCloseX');
    const helpConfirmBtn = widget.querySelector('#aliHelpConfirmBtn');

    // Sub-Tab Switcher
    const tabFiltersBtn = widget.querySelector('#aliNavTabFilters');
    const tabDealsBtn = widget.querySelector('#aliNavTabDeals');
    const viewFilters = widget.querySelector('#aliViewFilters');
    const viewDeals = widget.querySelector('#aliViewDeals');

    function switchSubTab(tab) {
      currentTab = tab;
      if (tab === 'filters') {
        if (tabFiltersBtn) tabFiltersBtn.classList.add('active');
        if (tabDealsBtn) tabDealsBtn.classList.remove('active');
        if (viewFilters) viewFilters.classList.remove('ali-tab-hidden');
        if (viewDeals) viewDeals.classList.add('ali-tab-hidden');
      } else {
        if (tabFiltersBtn) tabFiltersBtn.classList.remove('active');
        if (tabDealsBtn) tabDealsBtn.classList.add('active');
        if (viewFilters) viewFilters.classList.add('ali-tab-hidden');
        if (viewDeals) viewDeals.classList.remove('ali-tab-hidden');
        renderPromotionsView(widget);
      }
    }

    if (tabFiltersBtn) {
      tabFiltersBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchSubTab('filters');
      });
    }

    if (tabDealsBtn) {
      tabDealsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchSubTab('deals');
      });
    }

    // Initial render of promotions
    renderPromotionsView(widget);

    setupDraggable(widget);

    function openHelp() {
      if (helpOverlay) helpOverlay.classList.add('open');
      if (helpBtn) helpBtn.classList.add('active');
    }

    function closeHelp() {
      if (helpOverlay) helpOverlay.classList.remove('open');
      if (helpBtn) helpBtn.classList.remove('active');
      if (!hasSeenGuide) {
        hasSeenGuide = true;
        chrome.storage.local.set({ hasSeenGuide: true });
      }
    }

    if (helpBtn) {
      helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (helpOverlay && helpOverlay.classList.contains('open')) {
          closeHelp();
        } else {
          openHelp();
        }
      });
    }

    if (helpCloseX) {
      helpCloseX.addEventListener('click', (e) => {
        e.stopPropagation();
        closeHelp();
      });
    }

    if (helpConfirmBtn) {
      helpConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeHelp();
      });
    }

    // Auto show guide on first install/visit
    if (!hasSeenGuide && !settings.minimized) {
      openHelp();
    }

    if (pill) {
      pill.addEventListener('click', () => {
        if (!hasSeenGuide) {
          openHelp();
        }
      });
    }

    if (langBtn) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLang = (currentLang === 'ko') ? 'en' : 'ko';
        chrome.storage.local.set({ lang: currentLang });
        showToast(t('toastLangSwitched'));
        updateWidgetLanguage(widget);
        updateWidgetUI();
        processAllCards();
      });
    }

    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeHelp();
      widget.classList.add('compact-mode');
      settings.minimized = true;
      chrome.storage.local.set({ minimized: true });
    });

    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settings.pinned = !settings.pinned;
      pinBtn.classList.toggle('active', settings.pinned);
      chrome.storage.local.set({ pinned: settings.pinned });
      showToast(settings.pinned ? t('pinnedToast') : t('unpinnedToast'));
    });

    document.addEventListener('click', (e) => {
      if (!settings.pinned && !widget.contains(e.target) && !widget.classList.contains('compact-mode')) {
        widget.classList.add('compact-mode');
        closeHelp();
      }
    });

    const powerBtn = widget.querySelector('#aliTogglePower');
    powerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMasterPower();
    });

    // Custom Keyword Input
    const input = widget.querySelector('#aliAddKwInput');
    const addBtn = widget.querySelector('#aliAddKwBtn');

    function addCustomKeyword() {
      const val = input.value.trim();
      if (!val) return;
      keywords.push({
        id: `custom_${Date.now()}_${val}`,
        text: val,
        active: true,
        custom: true,
        isStopword: false
      });
      input.value = '';
      updateWidgetUI();
      processAllCards();
    }

    addBtn.addEventListener('click', addCustomKeyword);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addCustomKeyword();
    });

    // Negative Keywords Events
    const negInput = widget.querySelector('#aliAddNegInput');
    const addNegBtn = widget.querySelector('#aliAddNegBtn');

    function addNegativeKeyword(word) {
      const val = (word || negInput.value).trim();
      if (!val) return;
      if (!negativeKeywords.includes(val)) {
        negativeKeywords.push(val);
        chrome.storage.local.set({ negativeKeywords });
        showToast(currentLang === 'ko' ? `제외 단어 등록: "- ${val}"` : `Exclude registered: "- ${val}"`);
      }
      negInput.value = '';
      updateWidgetUI();
      processAllCards();
    }

    if (addNegBtn) addNegBtn.addEventListener('click', () => addNegativeKeyword());
    if (negInput) {
      negInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addNegativeKeyword();
      });
    }

    widget.querySelectorAll('.ali-quick-neg-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        addNegativeKeyword(chip.dataset.word);
      });
    });

    // Sales Filter Events
    widget.querySelectorAll('#aliSalesPillGroup .ali-preset-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        widget.querySelectorAll('#aliSalesPillGroup .ali-preset-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.sales !== '' ? parseInt(btn.dataset.sales, 10) : null;
        minSales = val;
        chrome.storage.local.set({ minSales });
        showToast(minSales ? (currentLang === 'ko' ? `판매량 ${minSales.toLocaleString()}개 이상 필터` : `Sales filter: ${minSales.toLocaleString()}+`) : (currentLang === 'ko' ? '판매량 제한 해제' : 'Sales filter removed'));
        processAllCards();
      });
    });

    // Rating Filter Events
    widget.querySelectorAll('#aliRatingPillGroup .ali-preset-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        widget.querySelectorAll('#aliRatingPillGroup .ali-preset-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.rating !== '' ? parseFloat(btn.dataset.rating) : null;
        minRating = val;
        chrome.storage.local.set({ minRating });
        showToast(minRating ? (currentLang === 'ko' ? `평점 ★ ${minRating} 이상 필터` : `Rating filter: ★ ${minRating}+`) : (currentLang === 'ko' ? '평점 제한 해제' : 'Rating filter removed'));
        processAllCards();
      });
    });

    // Price Filter Events
    const minInput = widget.querySelector('#aliPriceMin');
    const maxInput = widget.querySelector('#aliPriceMax');
    const applyPriceBtn = widget.querySelector('#aliPriceApplyBtn');

    function applyCurrentPriceFilter() {
      const minVal = minInput.value.trim() !== '' ? parseFloat(minInput.value) : null;
      const maxVal = maxInput.value.trim() !== '' ? parseFloat(maxInput.value) : null;
      priceFilter.min = minVal;
      priceFilter.max = maxVal;

      const isUsd = (detectedCurrency === 'USD');
      if (minVal !== null || maxVal !== null) {
        const rangeText = `${minVal ? (isUsd ? '$' + minVal : minVal.toLocaleString() + '원') + ' ~ ' : ''}${maxVal ? (isUsd ? '$' + maxVal : maxVal.toLocaleString() + '원') + ' ' + (currentLang === 'ko' ? '이하' : 'max') : ''}`;
        showToast(currentLang === 'ko' ? `가격 필터: ${rangeText}` : `Price filter: ${rangeText}`);
      }

      updateWidgetUI();
      processAllCards();
    }

    applyPriceBtn.addEventListener('click', applyCurrentPriceFilter);
    minInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyCurrentPriceFilter(); });
    maxInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyCurrentPriceFilter(); });

    // Mode Buttons
    widget.querySelectorAll('.ali-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        widget.querySelectorAll('.ali-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.mode = btn.dataset.mode;
        chrome.storage.local.set({ mode: settings.mode });
        processAllCards();
      });
    });

    const andCheck = widget.querySelector('#aliCheckAnd');
    andCheck.addEventListener('change', () => {
      settings.matchCondition = andCheck.checked ? 'AND' : 'OR';
      chrome.storage.local.set({ matchCondition: settings.matchCondition });
      processAllCards();
    });

    const adCheck = widget.querySelector('#aliCheckHideAds');
    adCheck.addEventListener('change', () => {
      settings.hideAds = adCheck.checked;
      chrome.storage.local.set({ hideAds: settings.hideAds });
      processAllCards();
    });

    widget.querySelector('#aliRescanBtn').addEventListener('click', () => {
      extractKeywords();
      processAllCards();
    });
  }

  /**
   * 6-1. Instant In-Place Language Switcher
   */
  function updateWidgetLanguage(widget) {
    if (!widget) widget = document.getElementById('ali-filter-widget');
    if (!widget) return;

    // Header actions
    const langBtn = widget.querySelector('#aliLangBtn');
    if (langBtn) {
      langBtn.textContent = currentLang.toUpperCase();
      langBtn.title = t('langTooltip');
    }
    const helpBtn = widget.querySelector('#aliHelpBtn');
    if (helpBtn) helpBtn.title = t('helpTooltip');
    const pinBtn = widget.querySelector('#aliPinBtn');
    if (pinBtn) pinBtn.title = t('pinTooltip');
    const powerBtn = widget.querySelector('#aliTogglePower');
    if (powerBtn) powerBtn.title = t('powerTooltip');
    const collapseBtn = widget.querySelector('#aliCollapseBtn');
    if (collapseBtn) collapseBtn.title = t('collapseTooltip');

    // Sub-Tabs
    const tabFiltersText = widget.querySelector('#aliNavTabFiltersText');
    if (tabFiltersText) tabFiltersText.textContent = t('tabFilter');
    const tabDealsText = widget.querySelector('#aliNavTabDealsText');
    if (tabDealsText) tabDealsText.textContent = t('tabDeals');

    // Deals View Headers
    const couponsSecTitle = widget.querySelector('#aliCouponsSecTitle');
    if (couponsSecTitle) couponsSecTitle.textContent = t('couponsSecTitle');
    const couponsSecHint = widget.querySelector('#aliCouponsSecHint');
    if (couponsSecHint) couponsSecHint.textContent = t('couponsSecHint');
    const hotdealsSecTitle = widget.querySelector('#aliHotdealsSecTitle');
    if (hotdealsSecTitle) hotdealsSecTitle.textContent = t('hotdealsSecTitle');
    const hotdealsSecHint = widget.querySelector('#aliHotdealsSecHint');
    if (hotdealsSecHint) hotdealsSecHint.textContent = t('hotdealsSecHint');
    const affiliateNotice = widget.querySelector('#aliAffiliateNotice');
    if (affiliateNotice) affiliateNotice.textContent = t('affiliateNotice');

    // Re-render promotions in updated language
    renderPromotionsView(widget);

    // Section 1: Must Keywords
    const sec1 = widget.querySelector('.ali-panel-body > div:nth-child(1)');
    if (sec1) {
      const title = sec1.querySelector('.ali-sec-title');
      const info = sec1.querySelector('.ali-sec-info');
      const input = sec1.querySelector('#aliAddKwInput');
      const btn = sec1.querySelector('#aliAddKwBtn');
      if (title) title.textContent = t('mustKw');
      if (info) info.textContent = t('clickOnOff');
      if (input) input.placeholder = t('addKwPlaceholder');
      if (btn) btn.textContent = t('addBtn');
    }

    // Section 2: Exclude Keywords
    const sec2 = widget.querySelector('.ali-panel-body > div:nth-child(2)');
    if (sec2) {
      const title = sec2.querySelector('.ali-sec-title');
      const info = sec2.querySelector('.ali-sec-info');
      const qLabel = sec2.querySelector('.ali-quick-label');
      const qChips = sec2.querySelectorAll('.ali-quick-neg-chip');
      const input = sec2.querySelector('#aliAddNegInput');
      const btn = sec2.querySelector('#aliAddNegBtn');
      if (title) title.textContent = t('excludeKw');
      if (info) info.textContent = t('cutIfMatched');
      if (qLabel) qLabel.textContent = t('quickRecommend');
      if (qChips.length >= 4) {
        qChips[0].textContent = t('quickCase');
        qChips[1].textContent = t('quickStrap');
        qChips[2].textContent = t('quickFilm');
        qChips[3].textContent = t('quickParts');
      }
      if (input) input.placeholder = t('addNegPlaceholder');
      if (btn) btn.textContent = t('addNegBtn');
    }

    // Section 3: Trust Filter (Sales & Rating)
    const sec3 = widget.querySelector('.ali-trust-section');
    if (sec3) {
      const title = sec3.querySelector('.ali-sec-title');
      const info = sec3.querySelector('.ali-sec-info');
      const labels = sec3.querySelectorAll('.ali-trust-label');
      if (title) title.textContent = t('trustTitle');
      if (info) info.textContent = t('trustHint');
      if (labels[0]) labels[0].textContent = t('salesLabel');
      if (labels[1]) labels[1].textContent = t('ratingLabel');

      const salesBtns = sec3.querySelectorAll('#aliSalesPillGroup .ali-preset-pill');
      if (salesBtns.length >= 5) {
        salesBtns[0].textContent = t('all');
        salesBtns[1].textContent = (currentLang === 'ko' ? '50+개' : '50+');
        salesBtns[2].textContent = (currentLang === 'ko' ? '100+개' : '100+');
        salesBtns[3].textContent = (currentLang === 'ko' ? '500+개' : '500+');
        salesBtns[4].textContent = (currentLang === 'ko' ? '1천+개' : '1k+');
      }

      const ratingBtns = sec3.querySelectorAll('#aliRatingPillGroup .ali-preset-pill');
      if (ratingBtns.length >= 4) {
        ratingBtns[0].textContent = t('all');
      }
    }

    // Section 4: Price Filter
    const sec4 = widget.querySelector('.ali-price-section');
    if (sec4) {
      const title = sec4.querySelector('.ali-sec-title');
      const minInput = sec4.querySelector('#aliPriceMin');
      const maxInput = sec4.querySelector('#aliPriceMax');
      const applyBtn = sec4.querySelector('#aliPriceApplyBtn');
      if (title) title.textContent = t('priceTitle');
      if (minInput) minInput.placeholder = t('minPrice');
      if (maxInput) maxInput.placeholder = t('maxPrice');
      if (applyBtn) applyBtn.textContent = t('apply');
    }

    // Section 5: Mode Tabs
    const sec5 = widget.querySelector('.ali-panel-body > div:nth-child(5)');
    if (sec5) {
      const title = sec5.querySelector('.ali-sec-title');
      if (title) title.textContent = t('unmatchedTitle');
      const modeBtns = sec5.querySelectorAll('.ali-tab-btn');
      modeBtns.forEach(btn => {
        if (btn.dataset.mode === 'hide') btn.textContent = t('modeHide');
        if (btn.dataset.mode === 'dim') btn.textContent = t('modeDim');
        if (btn.dataset.mode === 'highlight-only') btn.textContent = t('modeHighlight');
      });
    }

    // Section 6: Switches
    const switchRows = widget.querySelectorAll('.ali-switch-row span');
    if (switchRows.length >= 2) {
      switchRows[0].textContent = t('checkAnd');
      switchRows[1].textContent = t('checkAds');
    }

    // Footer
    const footerCount = widget.querySelector('.ali-footer-count');
    if (footerCount) {
      footerCount.innerHTML = `${t('matchedCount')} <strong id="aliStatMatched">${currentStats.matched}</strong> / ${t('totalCount')} <span id="aliStatTotal">${currentStats.total}</span>`;
    }
    const rescanBtnText = widget.querySelector('#aliRescanBtn span');
    if (rescanBtnText) rescanBtnText.textContent = t('rescan');

    // Help Overlay
    const helpTitle = widget.querySelector('#aliHelpTitle');
    if (helpTitle) helpTitle.textContent = t('helpTitle');
    const helpSubtitle = widget.querySelector('#aliHelpSubtitle');
    if (helpSubtitle) helpSubtitle.textContent = t('helpSubtitle');
    for (let i = 1; i <= 5; i++) {
      const hTitle = widget.querySelector(`#aliHelpItem${i}Title`);
      const hDesc = widget.querySelector(`#aliHelpItem${i}Desc`);
      if (hTitle) hTitle.textContent = t(`helpItem${i}Title`);
      if (hDesc) hDesc.textContent = t(`helpItem${i}Desc`);
    }
    const helpConfirmBtn = widget.querySelector('#aliHelpConfirmBtn');
    if (helpConfirmBtn) helpConfirmBtn.textContent = t('helpCloseBtn');
  }

  /**
   * 7. Update Widget UI Elements
   */
  function updateWidgetUI() {
    const widget = document.getElementById('ali-filter-widget');
    if (!widget) return;

    const isUsd = (detectedCurrency === 'USD');
    const currencySymbol = isUsd ? '$' : '₩';

    const priceHint = widget.querySelector('#aliPriceHint');
    if (priceHint) priceHint.textContent = isUsd ? t('currHintUsd') : t('currHintKrw');

    const minSymbol = widget.querySelector('#aliMinSymbol');
    const maxSymbol = widget.querySelector('#aliMaxSymbol');
    if (minSymbol) minSymbol.textContent = currencySymbol;
    if (maxSymbol) maxSymbol.textContent = currencySymbol;

    const minInput = widget.querySelector('#aliPriceMin');
    const maxInput = widget.querySelector('#aliPriceMax');

    // Presets
    const presetsWrap = widget.querySelector('.ali-price-presets-wrap');
    if (presetsWrap) {
      const presets = isUsd ? [
        { label: '~$5', min: '', max: '5' },
        { label: '~$10', min: '', max: '10' },
        { label: '$10–$30', min: '10', max: '30' },
        { label: 'Min $2', min: '2', max: '', title: currentLang === 'ko' ? '2달러 미만 낚시옵션 제거' : 'Filter bait options under $2' },
      ] : [
        { label: currentLang === 'ko' ? '~5천원' : '~₩5k', min: '', max: '5000' },
        { label: currentLang === 'ko' ? '~1만원' : '~₩10k', min: '', max: '10000' },
        { label: currentLang === 'ko' ? '1만–3만원' : '₩10k–₩30k', min: '10000', max: '30000' },
        { label: currentLang === 'ko' ? '2천원 이상' : 'Min ₩2k', min: '2000', max: '', title: currentLang === 'ko' ? '2천원 미만 낚시옵션 제거' : 'Filter bait options under ₩2k' },
      ];

      presetsWrap.innerHTML = presets.map(p => {
        const pMin = p.min !== '' ? parseFloat(p.min) : null;
        const pMax = p.max !== '' ? parseFloat(p.max) : null;
        const isActive = (priceFilter.min === pMin && priceFilter.max === pMax);
        return `<button type="button" class="ali-preset-pill ${isActive ? 'active' : ''}" data-min="${p.min}" data-max="${p.max}" ${p.title ? `title="${p.title}"` : ''}>${p.label}</button>`;
      }).join('') + `<button type="button" class="ali-preset-pill reset" id="aliPriceResetBtn">${t('reset')}</button>`;

      presetsWrap.querySelectorAll('.ali-preset-pill:not(.reset)').forEach(chip => {
        chip.addEventListener('click', () => {
          minInput.value = chip.dataset.min || '';
          maxInput.value = chip.dataset.max || '';
          const minVal = minInput.value.trim() !== '' ? parseFloat(minInput.value) : null;
          const maxVal = maxInput.value.trim() !== '' ? parseFloat(maxInput.value) : null;
          priceFilter.min = minVal;
          priceFilter.max = maxVal;
          const rangeText = `${minVal ? (isUsd ? '$' + minVal : minVal.toLocaleString() + '원') + ' ~ ' : ''}${maxVal ? (isUsd ? '$' + maxVal : maxVal.toLocaleString() + '원') + ' ' + (currentLang === 'ko' ? '이하' : 'max') : ''}`;
          showToast(currentLang === 'ko' ? `가격 필터: ${rangeText}` : `Price filter: ${rangeText}`);
          updateWidgetUI();
          processAllCards();
        });
      });

      const resetBtn = presetsWrap.querySelector('#aliPriceResetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          minInput.value = '';
          maxInput.value = '';
          priceFilter.min = null;
          priceFilter.max = null;
          showToast(t('priceResetToast'));
          updateWidgetUI();
          processAllCards();
        });
      }
    }

    const pillStat = widget.querySelector('#aliPillStat');
    const pillPriceTag = widget.querySelector('#aliPillPriceTag');
    const powerBtn = widget.querySelector('#aliTogglePower');

    if (powerBtn) powerBtn.classList.toggle('active', settings.enabled);
    if (pillStat) pillStat.innerHTML = `<strong>${currentStats.matched}</strong>/${currentStats.total}`;

    if (pillPriceTag) {
      if (priceFilter.min !== null || priceFilter.max !== null) {
        pillPriceTag.style.display = 'inline-block';
        if (priceFilter.min !== null && priceFilter.max !== null) {
          pillPriceTag.textContent = isUsd 
            ? `$${priceFilter.min}–$${priceFilter.max}` 
            : `${priceFilter.min.toLocaleString()}–${priceFilter.max.toLocaleString()}원`;
        } else if (priceFilter.max !== null) {
          pillPriceTag.textContent = isUsd 
            ? `~$${priceFilter.max}` 
            : `~${priceFilter.max.toLocaleString()}원`;
        } else {
          pillPriceTag.textContent = isUsd 
            ? `$${priceFilter.min}+` 
            : `${priceFilter.min.toLocaleString()}원+`;
        }
      } else {
        pillPriceTag.style.display = 'none';
      }
    }

    const matchedEl = widget.querySelector('#aliStatMatched');
    const totalEl = widget.querySelector('#aliStatTotal');
    if (matchedEl) matchedEl.textContent = currentStats.matched;
    if (totalEl) totalEl.textContent = currentStats.total;

    const chipsWrap = widget.querySelector('#aliChipsWrap');
    if (!chipsWrap) return;

    chipsWrap.innerHTML = '';
    if (keywords.length === 0) {
      chipsWrap.innerHTML = `<span style="font-size: 11px; color: var(--af-text-disabled);">${t('noKw')}</span>`;
      return;
    }

    keywords.forEach(kw => {
      const chip = document.createElement('div');
      chip.className = `ali-chip ${kw.active ? 'active' : 'inactive'} ${kw.isStopword ? 'stopword-chip' : ''}`;
      chip.innerHTML = `
        <span>${escapeHtml(kw.text)}</span>
        ${kw.isStopword ? `<span class="ali-chip-tag">${t('stopwordTag')}</span>` : ''}
        ${kw.custom ? `<span class="ali-chip-remove" title="삭제">&times;</span>` : ''}
      `;

      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('ali-chip-remove')) {
          keywords = keywords.filter(k => k.id !== kw.id);
        } else {
          kw.active = !kw.active;
        }
        updateWidgetUI();
        processAllCards();
      });

      chipsWrap.appendChild(chip);
    });

    // Render Negative Chips
    const negChipsWrap = widget.querySelector('#aliNegChipsWrap');
    if (negChipsWrap) {
      negChipsWrap.innerHTML = '';
      if (negativeKeywords.length === 0) {
        negChipsWrap.innerHTML = `<span style="font-size: 11px; color: var(--af-text-disabled);">${t('noNegKw')}</span>`;
      } else {
        negativeKeywords.forEach(neg => {
          const negChip = document.createElement('div');
          negChip.className = 'ali-neg-chip';
          negChip.innerHTML = `
            <span>- ${escapeHtml(neg)}</span>
            <span class="ali-neg-chip-remove" title="제외 해제">&times;</span>
          `;
          negChip.querySelector('.ali-neg-chip-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            negativeKeywords = negativeKeywords.filter(w => w !== neg);
            chrome.storage.local.set({ negativeKeywords });
            showToast(currentLang === 'ko' ? `제외 단어 해제: "${neg}"` : `Exclude removed: "${neg}"`);
            updateWidgetUI();
            processAllCards();
          });
          negChipsWrap.appendChild(negChip);
        });
      }
    }

    // Sync Sales Pill States
    widget.querySelectorAll('#aliSalesPillGroup .ali-preset-pill').forEach(btn => {
      const val = btn.dataset.sales !== '' ? parseInt(btn.dataset.sales, 10) : null;
      btn.classList.toggle('active', minSales === val);
    });

    // Sync Rating Pill States
    widget.querySelectorAll('#aliRatingPillGroup .ali-preset-pill').forEach(btn => {
      const val = btn.dataset.rating !== '' ? parseFloat(btn.dataset.rating) : null;
      btn.classList.toggle('active', minRating === val);
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function observeDomChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      for (const m of mutations) {
        if (m.target && m.target.closest && (m.target.closest('#ali-filter-widget') || m.target.closest('#ali-filter-toast') || m.target.classList?.contains('ali-card-badge'))) {
          continue;
        }
        if (m.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }
      if (shouldProcess) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          processAllCards();
        }, 150);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function observeUrlChanges() {
    const checkUrl = () => {
      if (window.location.href !== lastProcessedUrl) {
        extractKeywords();
        updateWidgetUI();
        processAllCards();
      }
    };

    window.addEventListener('popstate', checkUrl);
    window.addEventListener('hashchange', checkUrl);

    const originalPush = history.pushState;
    history.pushState = function() {
      originalPush.apply(this, arguments);
      setTimeout(checkUrl, 100);
    };

    const originalReplace = history.replaceState;
    history.replaceState = function() {
      originalReplace.apply(this, arguments);
      setTimeout(checkUrl, 100);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
