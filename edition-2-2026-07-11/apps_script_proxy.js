/**
 * Codex ROCKET Dashboard v4 — Google Apps Script Data Proxy
 * ---------------------------------------------------------
 * Reads Dashboard Config, loads every visible source sheet, and returns one
 * normalized JSON payload for the dashboard.
 *
 * Matching rule:
 * - metric names are matched by text, not by row/column position;
 * - spaces, punctuation, case, ё/е, and common abbreviations are ignored;
 * - fuzzy similarity threshold is 0.72 (72%). This is high enough to accept
 *   small typos and wording drift, but low enough to avoid unrelated rows.
 */

const DASHBOARD_CONFIG_ID = '1EKR-czK1UvXZDIJUe5MLb70yZXyEMe1VIYTx15UOY3E';
const MATCH_MIN_SCORE = 0.72;
const MAX_RAW_ROWS = 3000;

const MONTH_NAMES = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
const MONTH_WORDS = {
  jan: 1, january: 1, янв: 1, январь: 1, января: 1,
  feb: 2, february: 2, фев: 2, февраль: 2, февраля: 2,
  mar: 3, march: 3, мар: 3, март: 3, марта: 3,
  apr: 4, april: 4, апр: 4, апрель: 4, апреля: 4,
  may: 5, май: 5, мая: 5,
  jun: 6, june: 6, июн: 6, июнь: 6, июня: 6,
  jul: 7, july: 7, июл: 7, июль: 7, июля: 7,
  aug: 8, august: 8, авг: 8, август: 8, августа: 8,
  sep: 9, sept: 9, september: 9, сен: 9, сент: 9, сентябрь: 9, сентября: 9,
  oct: 10, october: 10, окт: 10, октябрь: 10, октября: 10,
  nov: 11, november: 11, ноя: 11, ноябрь: 11, ноября: 11,
  dec: 12, december: 12, дек: 12, декабрь: 12, декабря: 12
};

const GENERIC_MATCH_TOKENS = {
  'выручка': true, 'revenue': true, 'traffic': true, 'трафик': true,
  'расходы': true, 'расход': true, 'затраты': true, 'затрат': true,
  'cost': true, 'costs': true, 'budget': true, 'бюджет': true,
  'коэффициент': true, 'ratio': true, 'доля': true, 'итого': true,
  'total': true, 'всего': true, 'прибыль': true, 'profit': true
};

const METRIC_REJECT_TOKENS = {
  var_costs: ['трафик', 'traffic', 'маркетинг', 'marketing', 'google', 'facebook', 'fb', 'tg', 'источник', 'канал', 'roi', 'ftd'],
  margin_pct: ['валов', 'операцион', 'ebitda', 'ebitdac', 'чист', 'чп', 'net profit'],
  gross_margin_pct: ['маржинальн', 'операцион', 'ebitda', 'ebitdac', 'чист', 'чп', 'net profit'],
  op_margin_pct: ['валов', 'маржинальн доход', 'чист', 'чп', 'net profit'],
  np_margin_pct: ['валов', 'маржинальн', 'операцион', 'ebitda', 'ebitdac', 'gross'],
  cash: ['opening cash', 'opening balance', 'начальн', 'начальный остаток'],
  total_ncf: ['opening cash', 'cash at end']
};

const METRIC_REQUIRED_TOKENS = {
  var_costs: ['переменн', 'variable'],
  op_margin_pct: ['операцион', 'ebitda', 'ebitdac'],
  np_margin_pct: ['чист', 'чп', 'net profit'],
  cash: ['cash at end', 'end of month', 'конец', 'конечн', 'остаток дс', 'денежные средства'],
  total_ncf: ['total ncf', 'monthly cash change', 'общий денежный поток', 'изменение денег за месяц общее'],
  de_ratio: ['debt', 'equity', 'долг', 'заемн', 'заёмн', 'рычаг', 'леверидж'],
  assets_total: ['assets', 'актив']
};

const METRICS = {
  revenue: [
    'выручка', 'итого выручка', 'общая выручка', 'revenue', 'total revenue',
    'доходы от реализации'
  ],
  var_costs: [
    'переменные расходы', 'переменные затраты', 'variable costs',
    'переменные', 'variable'
  ],
  margin_pct: [
    'рентабельность по маржинальному доходу', 'рентабельность маржинальная',
    'marginal income margin', 'contribution margin', 'margin pct'
  ],
  gross_margin_pct: [
    'рентабельность по валовой прибыли', 'gross profit margin', 'gross margin'
  ],
  op_margin_pct: [
    'рентабельность по операционной прибыли', 'рентабельность по ebitda',
    'рентабельность по ebitcac', 'ebitcac margin',
    'operating margin', 'ebitda margin'
  ],
  np_margin_pct: [
    'рентабельность по чп', 'рентабельность по чп общая',
    'рентабельность по чистой прибыли', 'рентабельность чистая прибыль',
    'net profit margin', 'np margin'
  ],
  traffic_cost: [
    'затраты на трафик', 'расходы на трафик', 'traffic cost', 'traffic costs',
    'маркетинг трафик'
  ],
  indirect: [
    'косвенные расходы', 'постоянные расходы', 'накладные расходы',
    'fixed costs', 'overhead', 'административные расходы'
  ],
  op_profit: [
    'операционная прибыль', 'прибыль от продаж', 'ebit', 'ebitda',
    'операционный результат', 'operating profit'
  ],
  interest: [
    'проценты', 'проценты по кредитам', 'финансовые расходы',
    'interest expense', 'interest'
  ],
  net_profit: [
    'чистая прибыль', 'чистая прибыль за период', 'net profit',
    'прибыль после налога', 'чп'
  ],
  ncf_op: [
    'ncf операционный', 'операционный денежный поток', 'поток от операционной',
    'cash flow operating', 'операционная деятельность', 'ncf операционная деятельность'
  ],
  ncf_inv: [
    'ncf инвестиционный', 'инвестиционный денежный поток', 'поток от инвестиционной',
    'cash flow investing', 'инвестиционная деятельность', 'ncf инвестиционная деятельность'
  ],
  ncf_fin: [
    'ncf финансовый', 'финансовый денежный поток', 'поток от финансовой',
    'cash flow financing', 'финансовая деятельность', 'ncf финансовая деятельность'
  ],
  total_ncf: [
    'total ncf monthly cash change', 'total ncf', 'общий денежный поток',
    'итого денежный поток', 'monthly cash change',
    'total monthly cash change', 'ncf изменение денег за месяц общее',
    'изменение денег за месяц общее'
  ],
  dividends: [
    'дивиденды', 'дивиденты', 'dividends', 'выплата дивидендов'
  ],
  cash: [
    'остаток дс', 'остаток денежных средств', 'конечный остаток',
    'cash balance', 'денежные средства', 'деньги на конец',
    'cash at end of month', 'ending cash balance'
  ],
  assets_total: [
    'активы всего', 'итого активы', 'total assets',
    'assets total', 'assets', 'активы'
  ],
  equity: [
    'собственный капитал', 'капитал', 'equity', 'own capital'
  ],
  liabilities: [
    'обязательства', 'итого обязательства', 'liabilities', 'total liabilities'
  ],
  lt_debt: [
    'долгосрочные займы', 'долгосрочный долг', 'long term debt', 'lt debt'
  ],
  st_debt: [
    'краткосрочные займы', 'краткосрочный долг', 'short term debt', 'st debt'
  ],
  kz: [
    'кредиторская задолженность', 'кз', 'accounts payable', 'payables'
  ],
  current_ratio: [
    'текущая ликвидность', 'current ratio', 'коэффициент текущей ликвидности'
  ],
  abs_liquidity: [
    'абсолютная ликвидность', 'absolute liquidity'
  ],
  fin_stability: [
    'финансовая устойчивость', 'financial stability'
  ],
  autonomy: [
    'коэффициент автономии', 'автономия', 'autonomy ratio', 'equity ratio'
  ],
  de_ratio: [
    'd/e', 'de ratio', 'debt equity', 'долг капитал', 'долг к капиталу',
    'заемный капитал собственный капитал', 'заёмный капитал собственный капитал',
    'финансовый рычаг заемный капитал', 'финансовый рычаг заёмный капитал',
    'debt to equity ratio'
  ],
  dfl: [
    'dfl', 'эффект финансового рычага', 'финансовый рычаг'
  ],
  roe_monthly: [
    'roe', 'рентабельность собственного капитала'
  ],
  roa_monthly: [
    'roa', 'рентабельность активов'
  ],
  rev_core: [
    'core выручка', 'igaming core', 'выручка core', 'core revenue',
    'выручка основная деятельность'
  ],
  rev_streams: [
    'streams выручка', 'rocket streams', 'выручка streams', 'stream revenue'
  ],
  rev_influence: [
    'influence выручка', 'выручка influence', 'инфлюенс', 'influence revenue'
  ],
  rev_mannequin: [
    'mannequin выручка', 'выручка mannequin', 'манекен', 'mannequin revenue'
  ],
  tr_fb: [
    'facebook', 'fb budget', 'fb бюджет', 'фейсбук'
  ],
  tr_tg: [
    'telegram', 'tg budget', 'tg бюджет', 'телеграм'
  ],
  tr_teasers: [
    'teasers', 'тизеры', 'teaser'
  ],
  tr_influence: [
    'traffic influence', 'трафик influence', 'инфлюенс трафик'
  ],
  tr_pp: [
    'pp', 'партнерская программа', 'партнерки'
  ],
  tr_google: [
    'google', 'google ads', 'гугл'
  ],
  ftd_old: [
    'ftd old', 'ftd старые', 'ftd crm', 'ftd база', 'ftd базовые'
  ],
  ftd_new: [
    'ftd new', 'ftd новые', 'новые ftd'
  ],
  ftd_total: [
    'ftd total', 'ftd всего', 'всего ftd'
  ],
  crm_rev: [
    'crm выручка', 'выручка crm', 'crm revenue'
  ],
  crm_pct: [
    'crm %', 'crm%', 'доля crm', 'crm доля'
  ]
};

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'get_all');
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  let result;
  try {
    if (['get_all', 'getData', 'get_data'].indexOf(action) >= 0) result = getAllData();
    else if (action === 'getConfig') result = getConfig();
    else result = { ok: false, error: 'Unknown action: ' + action };
  } catch (err) {
    result = { ok: false, error: err.message, stack: err.stack };
  }
  return jsonOut(result, callback);
}

function doPost(e) {
  let result;
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'write_speaker_note' || body.action === 'writeSpeakerNote') {
      result = writeSpeakerNote(body.note || body);
    } else if (body.action === 'add_note' || body.action === 'writeNote') {
      result = writeNote(body.note || body);
    } else {
      result = { ok: false, error: 'Unknown POST action' };
    }
  } catch (err) {
    result = { ok: false, error: err.message };
  }
  return jsonOut(result);
}

function jsonOut(obj, callback) {
  const json = JSON.stringify(obj);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllData() {
  const config = SpreadsheetApp.openById(DASHBOARD_CONFIG_ID);
  const reportsSheet = config.getSheetByName('Reports');
  if (!reportsSheet) throw new Error('Dashboard Config: sheet "Reports" not found');

  const reports = getSheetObjects(reportsSheet);
  const visibleReports = reports.filter(shouldReadReport);
  const out = createEmptyPayload();
  out.config_report_count = reports.length;
  out.visible_report_count = visibleReports.length;
  out.match_threshold = MATCH_MIN_SCORE;

  const contexts = [];
  visibleReports.forEach(report => {
    const context = readReport(report);
    if (!context) return;
    contexts.push(context);
    attachRawDataset(out, context);
  });

  const timeline = buildTimeline(contexts);
  out.months = timeline.map(p => p.label);
  out.month_keys = timeline.map(p => p.key);
  out.year = detectYear(timeline);

  contexts.forEach(context => mergeContextMetrics(out, context, timeline));
  deriveMetrics(out);
  trimEmptySeries(out);

  out.threshold_rules = getThresholdRules(config);
  out.assumptions = getAssumptions(config);
  out.notes = getNotes(config);
  out.speaker_notes = getSpeakerNotes(config);
  out.dashboard_links = getDashboardLinks(config, reports);
  out.tech_sheet = getTechSheet(config);
  out.metric_diagnostics = out.report_matches;
  out.analysis = getAiAnalysis(config);
  out.generated_at = new Date().toISOString();
  return out;
}

function createEmptyPayload() {
  const out = {
    ok: true,
    months: [],
    month_keys: [],
    year: new Date().getFullYear(),
    report_errors: [],
    report_matches: [],
    raw_reports: []
  };
  Object.keys(METRICS).forEach(k => out[k] = []);
  [
    'margin_pct','gross_margin_pct','op_margin_pct','np_margin_pct',
    'pnl_data','pnl_combo','pnl_consol','model_data','payment_data','payment_plan_data',
    'dds_data','dds_operations_data','balance_data','traffic_data','tasks_data','ckp_data'
  ].forEach(k => out[k] = Array.isArray(out[k]) ? out[k] : null);
  out.threshold_rules = [];
  out.assumptions = [];
  out.notes = [];
  out.speaker_notes = [];
  out.dashboard_links = [];
  out.tech_sheet = null;
  out.metric_diagnostics = [];
  out.analysis = null;
  return out;
}

function isVisibleReport(report) {
  const value = getAny(report, ['visible','show','active','включен','видимый']);
  const s = norm(value);
  return ['true','1','yes','y','да','истина','верно','вкл'].indexOf(s) >= 0;
}

function shouldReadReport(report) {
  if (isVisibleReport(report)) return true;
  const rawId = norm(getAny(report, ['report_id','id','type','report_type','верхний_подвал','name','название']));
  const textId = normText(getAny(report, ['report_id','id','type','report_type','верхний_подвал','name','название']) + ' ' + getAny(report, ['description','описание','sheet_name','tab','лист','вкладка']));
  return rawId === 'dds_operations' ||
    rawId.indexOf('ddsoperations') >= 0 ||
    textId.indexOf('ддс месяц') >= 0 ||
    (textId.indexOf('движение денежных средств') >= 0 && (textId.indexOf('кошел') >= 0 || textId.indexOf('операц') >= 0));
}

function readReport(report) {
  const id = String(getAny(report, ['report_id','id','type','report_type','верхний_подвал','name','название']) || '').trim();
  const sheetRef = getAny(report, ['sheet_id','sheet_url','url','source','источник','ссылка']);
  const sheetName = String(getAny(report, ['sheet_name','tab','лист','вкладка']) || '').trim();
  if (!sheetRef || !sheetName) return null;

  try {
    const ss = SpreadsheetApp.openById(extractSheetId(sheetRef));
    const sheet = findSheet(ss, sheetName);
    if (!sheet) throw new Error('sheet not found: ' + sheetName);
    const values = sheet.getDataRange().getValues();
    const data = sanitizeGrid(values);
    const context = {
      id: id || sheetName,
      report,
      source_url: String(sheetRef || ''),
      spreadsheet_id: extractSheetId(sheetRef),
      sheet_name: sheet.getName(),
      spreadsheet_name: ss.getName(),
      data,
      month_columns: findMonthColumns(data)
    };
    context.metrics = extractMetrics(context);
    return context;
  } catch (err) {
    return {
      id: id || sheetName,
      report,
      source_url: String(sheetRef || ''),
      spreadsheet_id: extractSheetId(sheetRef),
      sheet_name: sheetName,
      data: [],
      month_columns: [],
      metrics: {},
      error: err.message
    };
  }
}

function attachRawDataset(out, context) {
  const raw = context.data.slice(0, MAX_RAW_ROWS);
  const idNorm = normText(context.id + ' ' + context.sheet_name + ' ' + context.spreadsheet_name);
  out.raw_reports.push({
    id: context.id,
    sheet_name: context.sheet_name,
    spreadsheet_name: context.spreadsheet_name,
    spreadsheet_id: context.spreadsheet_id || '',
    source_url: context.source_url || '',
    rows: raw.length,
    error: context.error || '',
    matched_metrics: Object.keys(context.metrics || {})
  });
  if (context.error) out.report_errors.push(context.id + ': ' + context.error);
  if ((idNorm.indexOf('opiu') >= 0 || idNorm.indexOf('опиу') >= 0 || idNorm.indexOf('pnl') >= 0) &&
      idNorm.indexOf('combo') < 0 && idNorm.indexOf('блок') < 0 &&
      idNorm.indexOf('consol') < 0 && idNorm.indexOf('консол') < 0 &&
      idNorm.indexOf('model') < 0 && idNorm.indexOf('модел') < 0) out.pnl_data = raw;
  if (idNorm.indexOf('combo') >= 0 || idNorm.indexOf('блок') >= 0) out.pnl_combo = raw;
  if (idNorm.indexOf('consol') >= 0 || idNorm.indexOf('консол') >= 0) out.pnl_consol = raw;
  if (idNorm.indexOf('model') >= 0 || idNorm.indexOf('модел') >= 0) out.model_data = raw;
  if (idNorm.indexOf('payment') >= 0 || idNorm.indexOf('плат') >= 0 || idNorm.indexOf('календар') >= 0) out.payment_data = raw;
  if (idNorm.indexOf('плановый реестр') >= 0 || idNorm.indexOf('payment_plan') >= 0) out.payment_plan_data = raw;
  if (idNorm.indexOf('ддс') >= 0 || idNorm.indexOf('cash flow') >= 0 || idNorm.indexOf('cashflow') >= 0) {
    if (idNorm.indexOf('операц') >= 0 || idNorm.indexOf('кошел') >= 0 || idNorm.indexOf('operations') >= 0) out.dds_operations_data = raw;
    else out.dds_data = raw;
  }
  if (idNorm.indexOf('баланс') >= 0 || idNorm.indexOf('balance') >= 0) out.balance_data = raw;
  if (idNorm.indexOf('traffic') >= 0 || idNorm.indexOf('трафик') >= 0) out.traffic_data = raw;
  if (idNorm.indexOf('task') >= 0 || idNorm.indexOf('задач') >= 0 || idNorm.indexOf('свод') >= 0) out.tasks_data = raw;
  if (idNorm.indexOf('цкп') >= 0 || idNorm.indexOf('ckp') >= 0) out.ckp_data = raw;
}

function buildTimeline(contexts) {
  const order = {};
  contexts.forEach(context => {
    (context.month_columns || []).forEach((m, idx) => {
      if (!m || !m.key) return;
      if (!order[m.key]) order[m.key] = { key: m.key, label: m.label, weight: 0, first: idx };
      order[m.key].weight += 1;
    });
  });
  let months = Object.keys(order).map(k => order[k]);
  months.sort((a, b) => a.key.localeCompare(b.key));

  if (months.length > 12) {
    const withValues = months.filter(m => m.key >= '2026-01' && m.key <= '2026-12');
    if (withValues.length >= 2) months = withValues;
  }
  return months;
}

function mergeContextMetrics(out, context, timeline) {
  if (!context.metrics || !timeline.length) return;
  Object.keys(context.metrics).forEach(metric => {
    const metricResult = context.metrics[metric];
    if (!metricResult || !metricResult.valuesByKey) return;
    const candidate = timeline.map(m => toNum(metricResult.valuesByKey[m.key]));
    if (!hasUsefulValues(candidate)) return;
    if (!hasUsefulValues(out[metric])) {
      out[metric] = candidate;
      out.report_matches.push({
        metric,
        report: context.id,
        sheet: context.sheet_name,
        label: metricResult.label,
        score: metricResult.score
      });
    }
  });
}

function extractMetrics(context) {
  const data = context.data || [];
  const months = context.month_columns || [];
  const result = {};
  if (!data.length || !months.length) return result;
  const allowed = allowedMetrics(context);

  const headerRow = months[0].row;
  for (let r = 0; r < data.length; r++) {
    if (r === headerRow) continue;
    const label = rowLabel(data[r], months);
    if (!label) continue;
    Object.keys(METRICS).forEach(metric => {
      if (allowed.indexOf(metric) < 0) return;
      const score = metricScoreFor(metric, label);
      if (score < MATCH_MIN_SCORE) return;
      const valuesByKey = {};
      months.forEach(m => {
        const value = toNum(data[r][m.col]);
        if (valuesByKey[m.key] === undefined || Math.abs(valuesByKey[m.key]) < 0.000001) {
          valuesByKey[m.key] = value;
        }
      });
      if (hasUsefulValues(Object.keys(valuesByKey).map(k => valuesByKey[k]))) {
        if (!result[metric] || score > result[metric].score) {
          result[metric] = { label, score: +score.toFixed(3), valuesByKey };
        }
      }
    });
  }
  return result;
}

function allowedMetrics(context) {
  const id = normText((context.id || '') + ' ' + (context.sheet_name || '') + ' ' + (context.spreadsheet_name || ''));
  const pnl = ['revenue','var_costs','traffic_cost','indirect','op_profit','interest','net_profit','dividends'];
  const margins = ['margin_pct','gross_margin_pct','op_margin_pct','np_margin_pct'];
  const dirs = ['rev_core','rev_streams','rev_influence','rev_mannequin'];
  const traffic = ['tr_fb','tr_tg','tr_teasers','tr_influence','tr_pp','tr_google','ftd_old','ftd_new','ftd_total','crm_rev','crm_pct'];
  const cashflow = ['ncf_op','ncf_inv','ncf_fin','total_ncf','dividends','cash'];
  const balance = ['assets_total','equity','liabilities','cash','lt_debt','st_debt','kz','current_ratio','abs_liquidity','fin_stability','autonomy','de_ratio','dfl','roe_monthly','roa_monthly'];
  if (id.indexOf('цкп') >= 0 || id.indexOf('roadmap') >= 0 || id.indexOf('задач') >= 0 || id.indexOf('task') >= 0) return [];
  if (id.indexOf('плат') >= 0 || id.indexOf('payment') >= 0 || id.indexOf('календар') >= 0) return cashflow;
  if (id.indexOf('баланс') >= 0 || id.indexOf('balance') >= 0) return balance;
  if (id.indexOf('ддс') >= 0 || id.indexOf('cashflow') >= 0 || id.indexOf('cash flow') >= 0) return cashflow;
  if (id.indexOf('traffic') >= 0 || id.indexOf('трафик') >= 0) return traffic.concat(['traffic_cost']);
  if (id.indexOf('model') >= 0 || id.indexOf('модел') >= 0) return traffic.concat(dirs).concat(['revenue']);
  if (id.indexOf('combo') >= 0 || id.indexOf('блок') >= 0) return pnl.concat(dirs).concat(traffic).concat(margins);
  if (id.indexOf('opiu') >= 0 || id.indexOf('опиу') >= 0 || id.indexOf('pnl') >= 0) return pnl.concat(dirs).concat(traffic).concat(margins);
  return pnl.concat(cashflow).concat(balance).concat(dirs).concat(traffic).concat(margins);
}

function rowLabel(row, months) {
  const monthCols = {};
  months.forEach(m => monthCols[m.col] = true);
  const pieces = [];
  for (let i = 0; i < Math.min(row.length, 8); i++) {
    if (monthCols[i]) continue;
    const value = row[i];
    if (value === '' || value === null || value === undefined) continue;
    if (typeof value === 'number' || value instanceof Date) continue;
    pieces.push(String(value));
  }
  return pieces.join(' ').trim();
}

function findMonthColumns(data) {
  let best = null;
  const maxRows = Math.min(data.length, 20);
  for (let r = 0; r < maxRows; r++) {
    const months = [];
    for (let c = 0; c < data[r].length; c++) {
      const parsed = parseMonth(data[r][c], c, data, r);
      if (parsed) months.push({ row: r, col: c, key: parsed.key, label: parsed.label });
    }
    if (months.length >= 2 && (!best || months.length > best.length)) best = months;
  }
  return best || [];
}

function parseMonth(value, col, data, rowIdx) {
  if (!value && value !== 0) return null;
  if (value instanceof Date) {
    return monthObj(value.getFullYear(), value.getMonth() + 1);
  }
  if (typeof value === 'number' && value >= 1 && value <= 12 && Math.floor(value) === value && looksLikeNumericMonthRow(data, rowIdx)) {
    return monthObj(inferYearFromNearbyHeaders(data, col) || getAnalysisYear(), value);
  }
  const s = String(value).trim();
  if (!s) return null;
  if (/^(1[0-2]|[1-9])$/.test(s) && looksLikeNumericMonthRow(data, rowIdx)) {
    return monthObj(inferYearFromNearbyHeaders(data, col) || getAnalysisYear(), +s);
  }
  const iso = s.match(/^(\d{4})[-/.](\d{1,2})/);
  if (iso) return monthObj(+iso[1], +iso[2]);

  const cleaned = normText(s);
  const parts = cleaned.split(' ').filter(Boolean);
  let month = null;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (MONTH_WORDS[p]) month = MONTH_WORDS[p];
    else {
      const short = p.slice(0, 3);
      if (MONTH_WORDS[short]) month = MONTH_WORDS[short];
    }
  }
  if (!month) return null;
  let year = null;
  const yearMatch = cleaned.match(/\b(20\d{2}|\d{2})\b/);
  if (yearMatch) {
    year = +yearMatch[1];
    if (year < 100) year += 2000;
  } else {
    year = inferYearFromNearbyHeaders(data, col) || getAnalysisYear();
  }
  return monthObj(year, month);
}

function looksLikeNumericMonthRow(data, rowIdx) {
  if (rowIdx === undefined || rowIdx === null || rowIdx < 0 || !data[rowIdx]) return false;
  const row = data[rowIdx];
  const nums = row.filter(v => {
    const n = typeof v === 'number' ? v : (/^(1[0-2]|[1-9])$/.test(String(v).trim()) ? +String(v).trim() : NaN);
    return Number.isFinite(n) && n >= 1 && n <= 12 && Math.floor(n) === n;
  });
  const text = normText(row.slice(0, 4).join(' '));
  return nums.length >= 2 && (text.indexOf('month') >= 0 || text.indexOf('месяц') >= 0 || nums.length >= 6);
}

function inferYearFromNearbyHeaders(data, col) {
  for (let r = 0; r < Math.min(data.length, 8); r++) {
    for (let c = Math.max(0, col - 2); c <= Math.min(data[r].length - 1, col + 2); c++) {
      const m = String(data[r][c] || '').match(/\b(20\d{2})\b/);
      if (m) return +m[1];
    }
  }
  return null;
}

function monthObj(year, month) {
  if (!year || !month || month < 1 || month > 12) return null;
  return {
    key: year + '-' + String(month).padStart(2, '0'),
    label: MONTH_NAMES[month - 1]
  };
}

function deriveMetrics(out) {
  const n = out.months.length;
  if (!n) return;
  ensureLen(out, 'traffic_cost');
  ensureLen(out, 'var_costs');
  ensureLen(out, 'revenue');
  ensureLen(out, 'net_profit');
  ensureLen(out, 'op_profit');
  ensureLen(out, 'interest');

  if (!hasUsefulValues(out.gross_margin_pct) && hasUsefulValues(out.revenue) && hasUsefulValues(out.var_costs)) {
    out.gross_margin_pct = pctSeries(out.revenue.map((v, i) => v - (out.var_costs[i] || 0)), out.revenue);
  }
  if (!hasUsefulValues(out.margin_pct)) out.margin_pct = out.gross_margin_pct.slice();
  if (!hasUsefulValues(out.op_margin_pct) && hasUsefulValues(out.revenue) && hasUsefulValues(out.op_profit)) {
    out.op_margin_pct = pctSeries(out.op_profit, out.revenue);
  }
  if (!hasUsefulValues(out.np_margin_pct) && hasUsefulValues(out.revenue) && hasUsefulValues(out.net_profit)) {
    out.np_margin_pct = pctSeries(out.net_profit, out.revenue);
  }
  if (!hasUsefulValues(out.ftd_total) && (hasUsefulValues(out.ftd_new) || hasUsefulValues(out.ftd_old))) {
    out.ftd_total = out.months.map((_, i) => (out.ftd_new[i] || 0) + (out.ftd_old[i] || 0));
  }
  if (!hasUsefulValues(out.crm_pct) && hasUsefulValues(out.crm_rev) && hasUsefulValues(out.revenue)) {
    out.crm_pct = pctSeries(out.crm_rev, out.revenue);
  }
}

function pctSeries(num, den) {
  return num.map((v, i) => den[i] ? +(v / den[i] * 100).toFixed(2) : 0);
}

function ensureLen(out, key) {
  if (!Array.isArray(out[key])) out[key] = [];
  while (out[key].length < out.months.length) out[key].push(0);
}

function trimEmptySeries(out) {
  Object.keys(METRICS).forEach(k => ensureLen(out, k));
  ['margin_pct','gross_margin_pct','op_margin_pct','np_margin_pct'].forEach(k => ensureLen(out, k));
}

function hasUsefulValues(values) {
  return Array.isArray(values) && values.some(v => v !== null && v !== '' && v !== undefined && !isNaN(+v) && Math.abs(+v) > 0.000001);
}

function metricScoreFor(metric, label) {
  const nLabel = normText(label);
  const rejects = METRIC_REJECT_TOKENS[metric] || [];
  if (rejects.some(t => nLabel.indexOf(normText(t)) >= 0)) return 0;
  const required = METRIC_REQUIRED_TOKENS[metric] || [];
  if (required.length && !required.some(t => nLabel.indexOf(normText(t)) >= 0)) return 0;
  let score = metricScore(label, METRICS[metric]);
  const exactBoosts = {
    op_margin_pct: ['рентабельность по операционной прибыли', 'рентабельность по ebitda', 'рентабельность по ebitcac', 'ebitdac margin'],
    np_margin_pct: ['рентабельность по чп', 'рентабельность по чп общая', 'рентабельность по чистой прибыли'],
    cash: ['cash at end of month', 'остаток денежных средств на конец', 'остаток дс на конец', 'конечный остаток'],
    total_ncf: ['total ncf monthly cash change', 'total ncf monthly cash', 'общий денежный поток']
  }[metric] || [];
  exactBoosts.forEach(alias => {
    const nAlias = normText(alias);
    if (nLabel === nAlias || nLabel.indexOf(nAlias) >= 0) score = Math.max(score, 0.995);
  });
  return score;
}

function metricScore(label, aliases) {
  const nLabel = normText(label);
  let best = 0;
  aliases.forEach(alias => {
    const nAlias = normText(alias);
    if (!nAlias) return;
    if (!hasRequiredSpecificToken(nLabel, nAlias)) return;
    if (nLabel === nAlias) best = Math.max(best, 1);
    if (nLabel.indexOf(nAlias) >= 0) best = Math.max(best, 0.94);
    best = Math.max(best, dice(nLabel, nAlias));
    best = Math.max(best, tokenOverlap(nLabel, nAlias));
  });
  return best;
}

function hasRequiredSpecificToken(label, alias) {
  const labelTokens = {};
  label.split(' ').filter(Boolean).forEach(t => labelTokens[t] = true);
  const specific = alias.split(' ').filter(Boolean).filter(t => !GENERIC_MATCH_TOKENS[t] && t.length > 1);
  if (!specific.length) return true;
  return specific.some(t => labelTokens[t]);
}

function tokenOverlap(a, b) {
  const at = a.split(' ').filter(Boolean);
  const bt = b.split(' ').filter(Boolean);
  if (!at.length || !bt.length) return 0;
  const set = {};
  at.forEach(t => set[t] = true);
  let hit = 0;
  bt.forEach(t => { if (set[t]) hit++; });
  return hit / Math.max(at.length, bt.length);
}

function dice(a, b) {
  const x = a.replace(/\s+/g, '');
  const y = b.replace(/\s+/g, '');
  if (!x || !y) return 0;
  if (x.length < 2 || y.length < 2) return x === y ? 1 : 0;
  const bigrams = {};
  for (let i = 0; i < x.length - 1; i++) {
    const bg = x.slice(i, i + 2);
    bigrams[bg] = (bigrams[bg] || 0) + 1;
  }
  let hits = 0;
  for (let i = 0; i < y.length - 1; i++) {
    const bg = y.slice(i, i + 2);
    if (bigrams[bg]) {
      bigrams[bg]--;
      hits++;
    }
  }
  return (2 * hits) / (x.length + y.length - 2);
}

function normText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/&/g, ' и ')
    .replace(/[%№#]/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\bчп\b/g, 'чистая прибыль')
    .replace(/\bопиу\b/g, 'отчет прибыли убытки')
    .replace(/\s+/g, ' ')
    .trim();
}

function norm(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '').trim();
}

function toNum(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  if (value instanceof Date) return 0;
  let s = String(value).trim();
  if (!s) return 0;
  let negative = false;
  if (/^\(.*\)$/.test(s)) negative = true;
  s = s.replace(/\s/g, '').replace(/[₽$€]/g, '').replace(/%/g, '').replace(/[()]/g, '');
  if (s.indexOf(',') >= 0 && s.indexOf('.') >= 0) s = s.replace(/,/g, '');
  else s = s.replace(',', '.');
  const n = parseFloat(s);
  if (isNaN(n)) return 0;
  return negative ? -n : n;
}

function sanitizeGrid(values) {
  return values
    .filter(row => row.some(c => c !== '' && c !== null && c !== undefined))
    .map(row => row.map(cell => cell instanceof Date ? cell : (typeof cell === 'string' ? cell.trim() : cell)));
}

function getAny(obj, keys) {
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (obj[k] !== undefined && obj[k] !== '') return obj[k];
  }
  return '';
}

function extractSheetId(urlOrId) {
  const s = String(urlOrId || '').trim();
  const match = s.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : s;
}

function findSheet(ss, requestedName) {
  const m = getAnalysisMonth();
  const y = getAnalysisYear();
  const variants = [
    requestedName,
    requestedName.replace(/{month}/g, String(m)).replace(/{year}/g, String(y)).replace(/{month_name}/g, getMonthName(m))
  ].filter(Boolean);
  for (let i = 0; i < variants.length; i++) {
    const exact = ss.getSheetByName(variants[i]);
    if (exact) return exact;
  }
  const target = normText(variants[variants.length - 1] || requestedName);
  const sheets = ss.getSheets();
  let best = null;
  sheets.forEach(sheet => {
    const score = dice(normText(sheet.getName()), target);
    if (!best || score > best.score) best = { sheet, score };
  });
  return best && best.score >= 0.78 ? best.sheet : null;
}

function getSheetObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h => String(h || '').toLowerCase().trim().replace(/\s+/g, '_'));
  return values.slice(1).filter(row => row.some(c => c !== '' && c !== null && c !== undefined)).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function detectYear(timeline) {
  const counts = {};
  timeline.forEach(m => {
    const y = String(m.key).slice(0, 4);
    counts[y] = (counts[y] || 0) + 1;
  });
  let best = new Date().getFullYear(), count = 0;
  Object.keys(counts).forEach(y => {
    if (counts[y] > count) {
      best = +y;
      count = counts[y];
    }
  });
  return best;
}

function getAnalysisMonth() {
  return getAssumptionNumber(['analysis_month', 'месяц анализа', 'месяц'], new Date().getMonth() + 1);
}

function getAnalysisYear() {
  return getAssumptionNumber(['analysis_year', 'год анализа', 'год'], new Date().getFullYear());
}

function getAssumptionNumber(keys, fallback) {
  try {
    const ss = SpreadsheetApp.openById(DASHBOARD_CONFIG_ID);
    const sheet = ss.getSheetByName('Допущения') || ss.getSheetByName('Assumptions');
    if (!sheet) return fallback;
    const rows = getSheetObjects(sheet);
    for (let i = 0; i < rows.length; i++) {
      const label = normText(getAny(rows[i], ['key','parameter','параметр','ключ','name','id','category','assumption_text']));
      for (let j = 0; j < keys.length; j++) {
        if (label.indexOf(normText(keys[j])) >= 0) {
          const n = parseInt(getAny(rows[i], ['value','значение','val','assumption_value']) || label.match(/\d+/));
          return isNaN(n) ? fallback : n;
        }
      }
    }
  } catch (err) {}
  return fallback;
}

function getMonthName(m) {
  const names = ['','Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  return names[m] || String(m);
}

function getThresholdRules(ss) {
  try {
    const s = ss.getSheetByName('Threshold Rules') || ss.getSheetByName('Пороговые правила');
    return s ? getSheetObjects(s) : [];
  } catch (err) { return []; }
}

function getAssumptions(ss) {
  try {
    const s = ss.getSheetByName('Допущения') || ss.getSheetByName('Assumptions');
    return s ? getSheetObjects(s) : [];
  } catch (err) { return []; }
}

function getNotes(ss) {
  try {
    const s = ss.getSheetByName('Notes') || ss.getSheetByName('Dashboard Notes');
    return s ? getSheetObjects(s) : [];
  } catch (err) { return []; }
}

function getSpeakerNotes(ss) {
  try {
    const s = ss.getSheetByName('Speaker Notes') || ss.getSheetByName('Presentation Notes') || ss.getSheetByName('Заметки докладчика');
    return s ? getSheetObjects(s) : [];
  } catch (err) { return []; }
}

function getDashboardLinks(ss, reports) {
  const rows = reports || [];
  return rows.filter(row => {
    const type = normText(getAny(row, ['type','report_type','kind','тип']));
    const id = normText(getAny(row, ['report_id','id','name','название','title']));
    const url = getAny(row, ['url','sheet_url','source','ссылка','link']);
    return url && (type.indexOf('dashboard link') >= 0 || type.indexOf('dashboard_link') >= 0 || type.indexOf('link') >= 0 || id.indexOf('внедренность') >= 0 || id.indexOf('тайм') >= 0);
  }).map(row => ({
    id: getAny(row, ['report_id','id','name','название']) || '',
    title: getAny(row, ['title','name','название','report_id','id']) || '',
    description: getAny(row, ['description','comment','описание','комментарий']) || '',
    url: getAny(row, ['url','sheet_url','source','ссылка','link']) || '',
    visible: isVisibleReport(row)
  })).filter(row => row.visible !== false);
}

function getTechSheet(ss) {
  try {
    const out = {};
    ['Reports','Notes','Speaker Notes','Presentation Notes','AI Analysis','Threshold Rules','Assumptions'].forEach(name => {
      const s = ss.getSheetByName(name);
      if (s) out[name] = getSheetObjects(s);
    });
    return out;
  } catch (err) { return null; }
}

function getAiAnalysis(ss) {
  try {
    const sheet = ss.getSheetByName('AI Analysis');
    if (!sheet) return null;
    const rows = getSheetObjects(sheet);
    rows.sort((a, b) => new Date(getAny(b, ['date','дата','created_at'])) - new Date(getAny(a, ['date','дата','created_at'])));
    const latest = rows[0];
    if (!latest) return null;
    return {
      text: getAny(latest, ['text','analysis','текст','вывод','content']),
      updated_at: getAny(latest, ['date','дата','created_at'])
    };
  } catch (err) { return null; }
}

function writeNote(note) {
  const ss = SpreadsheetApp.openById(DASHBOARD_CONFIG_ID);
  let sheet = ss.getSheetByName('Notes');
  if (!sheet) {
    sheet = ss.insertSheet('Notes');
    sheet.appendRow(['report_id', 'month', 'chart_id', 'text', 'created']);
  }
  sheet.appendRow([
    note.report_id || '',
    note.month || new Date().toISOString().slice(0, 7),
    note.chart_id || note.key || '',
    note.text || '',
    note.created || new Date()
  ]);
  return { ok: true };
}

function writeSpeakerNote(note) {
  const ss = SpreadsheetApp.openById(DASHBOARD_CONFIG_ID);
  let sheet = ss.getSheetByName('Speaker Notes') || ss.getSheetByName('Presentation Notes') || ss.getSheetByName('Заметки докладчика');
  if (!sheet) {
    sheet = ss.insertSheet('Speaker Notes');
    sheet.appendRow(['tab_id', 'block_id', 'block_title', 'note_text', 'visible', 'sort_order', 'updated_at', 'updated_by']);
  }
  sheet.appendRow([
    note.tab_id || '',
    note.block_id || note.chart_id || '',
    note.block_title || note.title || '',
    note.note_text || note.text || '',
    note.visible === false ? 'FALSE' : 'TRUE',
    note.sort_order || '',
    note.updated_at || new Date(),
    note.updated_by || 'dashboard'
  ]);
  return { ok: true };
}

function getConfig() {
  const ss = SpreadsheetApp.openById(DASHBOARD_CONFIG_ID);
  return {
    ok: true,
    reports: getSheetObjects(ss.getSheetByName('Reports')),
    threshold_rules: getThresholdRules(ss),
    assumptions: getAssumptions(ss)
  };
}
