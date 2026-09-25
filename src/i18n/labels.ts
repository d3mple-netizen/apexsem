import { defineDict, useDict } from './index';
import type { AuthorityTier, KeywordOpportunity, RoadmapItem, AdCopyVariant, GeoSignal, TopicalCluster } from '../types';

// Display names for the fixed enums the analysis engine emits. The engine keeps
// English identifiers; components translate at render time via useLabels().
type SubtopicFormat = TopicalCluster['clusterSubtopics'][number]['format'];

const en = {
  tier: {
    'Tier 3 (Emerging)': 'Tier 3 (Emerging)',
    'Tier 2 (Contender)': 'Tier 2 (Contender)',
    'Tier 1 (Market Leader)': 'Tier 1 (Market Leader)'
  } as Record<AuthorityTier, string>,
  intent: {
    Transactional: 'Transactional',
    Commercial: 'Commercial',
    Informational: 'Informational',
    'Competitor Conquest': 'Competitor conquest'
  } as Record<KeywordOpportunity['intent'], string>,
  level: { Low: 'Low', Medium: 'Medium', High: 'High', Critical: 'Critical', Transformational: 'Transformational', Easy: 'Easy' } as Record<string, string>,
  match: { Exact: 'Exact', Phrase: 'Phrase', Broad: 'Broad' } as Record<KeywordOpportunity['matchType'], string>,
  severity: { high: 'High', medium: 'Medium', low: 'Low' } as Record<'high' | 'medium' | 'low', string>,
  phase: {
    'Phase 1: 0-30 Days (Quick SEM Wins)': 'Days 0-30: quick paid-search wins',
    'Phase 2: 30-60 Days (Authority Acceleration)': 'Days 30-60: build authority',
    'Phase 3: 60-90 Days (T1 Market Dominance)': 'Days 60-90: lead the category'
  } as Record<RoadmapItem['phase'], string>,
  category: { SEM: 'Paid search', 'SEO/T1': 'SEO', CRO: 'Conversion', 'GEO/AI': 'AI search' } as Record<RoadmapItem['category'], string>,
  status: { pending: 'To do', in_progress: 'In progress', completed: 'Done' } as Record<RoadmapItem['status'], string>,
  campaign: {
    'Bottom-of-Funnel (BOFU)': 'Bottom of funnel',
    'Competitor Conquest': 'Competitor conquest',
    'Problem-Solution': 'Problem and solution',
    'Brand Defense': 'Brand defense'
  } as Record<AdCopyVariant['campaignType'], string>,
  geoStatus: { Cited: 'Cited', 'Partial Citation': 'Partly cited', Invisible: 'Not cited' } as Record<GeoSignal['status'], string>,
  format: {
    Comparison: 'Comparison',
    'How-to Guide': 'How-to guide',
    Template: 'Template',
    'ROI Calculator': 'ROI calculator',
    'Alternative Page': 'Alternatives page'
  } as Record<SubtopicFormat, string>
};

export const labels = defineDict(en, {
  tier: {
    'Tier 3 (Emerging)': 'Уровень 3: новичок',
    'Tier 2 (Contender)': 'Уровень 2: претендент',
    'Tier 1 (Market Leader)': 'Уровень 1: лидер рынка'
  },
  intent: {
    Transactional: 'Транзакционный',
    Commercial: 'Коммерческий',
    Informational: 'Информационный',
    'Competitor Conquest': 'Перехват у конкурентов'
  },
  level: { Low: 'Низкая', Medium: 'Средняя', High: 'Высокая', Critical: 'Критично', Transformational: 'Прорывная', Easy: 'Легко' },
  match: { Exact: 'Точное', Phrase: 'Фразовое', Broad: 'Широкое' },
  severity: { high: 'Высокий', medium: 'Средний', low: 'Низкий' },
  phase: {
    'Phase 1: 0-30 Days (Quick SEM Wins)': 'Дни 0-30: быстрый результат в рекламе',
    'Phase 2: 30-60 Days (Authority Acceleration)': 'Дни 30-60: наращиваем авторитет',
    'Phase 3: 60-90 Days (T1 Market Dominance)': 'Дни 60-90: выходим в лидеры'
  },
  category: { SEM: 'Реклама', 'SEO/T1': 'SEO', CRO: 'Конверсия', 'GEO/AI': 'AI-поиск' },
  status: { pending: 'В планах', in_progress: 'В работе', completed: 'Готово' },
  campaign: {
    'Bottom-of-Funnel (BOFU)': 'Низ воронки',
    'Competitor Conquest': 'Перехват у конкурентов',
    'Problem-Solution': 'Проблема и решение',
    'Brand Defense': 'Защита бренда'
  },
  geoStatus: { Cited: 'Цитирует', 'Partial Citation': 'Частично', Invisible: 'Не цитирует' },
  format: {
    Comparison: 'Сравнение',
    'How-to Guide': 'Инструкция',
    Template: 'Шаблон',
    'ROI Calculator': 'ROI-калькулятор',
    'Alternative Page': 'Подборка альтернатив'
  }
});

/** Enum display names for the active language; unknown values pass through. */
export function useLabels() {
  const d = useDict(labels);
  const pick = (map: Record<string, string>) => (key: string) => map[key] ?? key;
  return {
    tier: pick(d.tier),
    intent: pick(d.intent),
    level: pick(d.level),
    match: pick(d.match),
    severity: pick(d.severity),
    phase: pick(d.phase),
    category: pick(d.category),
    status: pick(d.status),
    campaign: pick(d.campaign),
    geoStatus: pick(d.geoStatus),
    format: pick(d.format)
  };
}
