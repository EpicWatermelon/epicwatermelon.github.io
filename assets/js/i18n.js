(function createPortfolioI18n(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PortfolioI18n = api;

  if (root?.document) {
    const start = () => {
      let storage = null;
      try {
        storage = root.localStorage;
      } catch {
        storage = null;
      }
      api.initializeLanguageSwitcher(root.document, storage);
      api.initializeContactEasterEgg(root.document);
    };
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  }
})(typeof window === 'undefined' ? globalThis : window, function portfolioI18nFactory() {
  'use strict';

  const storageKey = 'zhengji-portfolio-language';
  const attributeBindings = [
    ['aria-label', 'data-i18n-aria-label'],
    ['alt', 'data-i18n-alt'],
    ['data-mobile-label', 'data-i18n-data-mobile-label'],
    ['content', 'data-i18n-content'],
    ['lang', 'data-i18n-lang']
  ];
  const originalValues = new WeakMap();
  const initializedDocuments = new WeakSet();
  const contactEasterEggLyrics = [
    '蛋糕店里卖蛋糕',
    '面包店里卖面包',
    '菜市场里能买辣椒',
    '厨房里面有菜刀',
    '无线耳机没有线',
    '健身房里能锻炼',
    '吃面条你必须下面',
    '充电器他能充电',
    '手表店里卖手表',
    '饺子店能吃水饺',
    '小孩肯定比老人小',
    '一分钟是六十秒',
    '鸡蛋能做蛋炒饭',
    '蛋炒饭里有鸡蛋',
    '快的反义词是慢',
    '一乘一万得一万',
    '老婆饼里没老婆',
    '菠萝包里也没菠萝',
    '鱼香肉丝没有鱼肉',
    '麻婆豆腐没有麻婆',
    '这几年感觉白活',
    '出了社会没人管我',
    '这些也没人教我',
    '哎呀我去你不早说'
  ];

  const translations = {
    'zh-CN': {
      'meta.description': 'Zhengji Liu——从事工业视觉与眼科影像研究的图像处理工程师。',
      'meta.title': 'Zhengji Liu — 图像处理工程师 / 科研工作者',
      'skip.content': '跳至主要内容',
      'language.group': '语言',
      'language.english': '英文',
      'language.chinese': '中文',
      'language.changed.en': 'Language changed to English.',
      'language.changed.zh': '语言已切换为中文。',
      'progress.label': '网站建设进度：40%',
      'progress.text': '网站建设中 <b>40%</b>',
      'progress.close': '关闭建设日志',
      'progress.eyebrow': '00.30 / 建设日志',
      'progress.title': '仍在<br /><i>建设中</i>',
      'progress.current.title': '当前更新',
      'progress.current.bilingual': '中英文内容切换已上线，并会记住语言偏好。',
      'progress.current.scene': '响应式像素场景、动效控制和研究证据展示已完成。',
      'progress.next.title': '下一步更新',
      'progress.next.timeOfDay': '首页将根据时间切换风格，并接入已准备好的白天素材。',
      'progress.next.sync': '本地知识库与正式 CV 将通过共享内容源联动更新。',
      'nav.label': '作品集章节',
      'nav.home': '首页',
      'nav.bio': '简介',
      'nav.background': '履历',
      'nav.ophthalmic': '眼科视觉',
      'nav.industrial': '工业视觉',
      'nav.contact': '联系',
      'home.eyebrow': '00 / 时间之树',
      'home.role': '图像处理工程师 · 科研工作者',
      'home.enter': '进入履历',
      'bio.eyebrow': '01 / 个人轨道',
      'bio.title': '图像工程师<span>/</span><br />科研工作者',
      'bio.name': '刘正吉 Zhengji <strong>LIU</strong>',
      'bio.summary': '本人现为香港理工大学眼科视光学院博士研究生，导师为 <a href="https://www.polyu.edu.hk/so/people/academic-staff/rachel-chun/" target="_blank" rel="noreferrer">Prof. Rachel Ka-Man CHUN</a>。',
      'bio.work': '我的研究聚焦图像处理与机器学习方法，将眼科影像转化为具有临床意义的量化指标，重点关注儿童近视控制。',
      'bio.figure.alt': 'Q 版 Saber 抱着一大碗米饭。',
      'bio.figure.caption': '始于好奇。<br />饭碗依然要大。',
      'scroll.enter': '继续滚动',
      'background.eyebrow': '02 / 学术 / 职业',
      'background.title': '学术<br /><i>经历</i>',
      'background.statement': '横跨生物医学工程、眼科影像与应用计算机视觉的学习和研究经历。',
      'background.note': '在这些经历中，我持续探索如何将图像信号转化为可靠的临床判断与工程决策。',
      'background.gridLabel': '履历详情',
      'background.history.title': '教育 / 经历',
      'background.history.subtitle': '学位与科研岗位',
      'background.skills.title': '技能',
      'background.skills.subtitle': '工具、方法与语言',
      'background.publications.title': '论文',
      'background.publications.subtitle': '期刊论文、会议论文与会议摘要',
      'action.open': '打开',
      'action.openCase': '查看项目',
      'case.01': '项目 01',
      'case.02': '项目 02',
      'ophthalmic.eyebrow': '03 / 为医疗而视觉',
      'ophthalmic.title': '眼科<br /><i>视觉</i>',
      'ophthalmic.statement': '从图像信号出发，得到具有临床意义的测量结果。',
      'ophthalmic.casesLabel': '眼科视觉项目',
      'ophthalmic.case1.title': 'Corvis ST 角膜图像超分辨率',
      'ophthalmic.case2.title': '基于深度学习的脉络膜 OCT 分析',
      'ophthalmic.figure.octAlt': '风格化的光学相干断层扫描设备。',
      'ophthalmic.figure.saberAlt': '拿着圆框眼镜的 Q 版 Saber。',
      'ophthalmic.figure.caption': '观察 / 重建 / 转化',
      'industrial.eyebrow': '04 / 产线上的视觉',
      'industrial.title': '工业<br /><i>视觉</i>',
      'industrial.statement': '面向真实生产条件下质量检测的计算机视觉。',
      'industrial.casesLabel': '工业视觉项目',
      'industrial.case1.title': '电池极柱检测方案',
      'industrial.figure.lineAlt': '风格化的工厂视觉检测输送线。',
      'industrial.figure.saberAlt': '拿着扳手的 Q 版 Saber。',
      'industrial.figure.caption': '检测 / 判断 / 重复',
      'contact.eyebrow': '05 / 联系',
      'contact.title': '道阻且长<br /><i>行则将至。</i>',
      'contact.title.lang': 'zh-CN',
      'contact.invitation': '期待围绕眼科影像、计算机视觉与工业检测开展科研合作和工程交流。',
      'contact.email': '邮箱',
    'footer.generated': '使用 Codex 氛围编程制作',
      'project.closeBackdrop': '关闭项目详情',
      'project.methods': '项目方法',
      'project.proposedMethods': '拟采用的方法',
      'fact.organization': '合作单位',
      'fact.year': '年份',
      'fact.role': '我的角色',
      'fact.company': '服务公司',
      'fact.projectDate': '项目时间',
      'project.corvis.visualAlt': '论文中的 Corvis ST 角膜图像超分辨率对比图。',
      'project.corvis.paperCaption': '图 5 — 临床 Corvis ST 图像对比',
      'project.corvis.mapLabel': 'Corvis ST 序列处理流程',
      'project.corvis.mapKicker': '高速气冲成像',
      'project.corvis.mapInput': 'Corvis ST 序列',
      'project.corvis.mapEnhancement': '计算超分辨率',
      'project.corvis.mapEnhancementNote': '恢复纵向细节',
      'project.corvis.mapMeasurement': '角膜厚度测量',
      'project.corvis.mapMeasurementNote': '保留时间细节',
      'project.corvis.mapOutput': '动态角膜表征',
      'project.corvis.mapOutputNote': '正常组与圆锥角膜组',
      'project.corvis.eyebrow': '03.01 / 眼科视觉项目',
      'project.corvis.title': 'Corvis ST 角膜<br /><i>图像超分辨率</i>',
      'project.corvis.close': '关闭 Corvis ST 项目',
      'project.corvis.lede': '我们采用计算图像增强方法，从高帧率 Corvis ST 序列中恢复具有临床价值的纵向细节。',
      'project.corvis.organization': '北京同仁医院合作项目',
      'project.corvis.year': '2021',
      'project.corvis.role': '算法开发与图像分析',
      'project.corvis.challenge.title': '临床问题',
      'project.corvis.challenge.body': '光学畸变与采集误差限制了 Corvis ST 图像的纵向分辨率，可能掩盖角膜生物力学评估所需的细微形变模式。',
      'project.corvis.contribution.title': '项目贡献',
      'project.corvis.contribution.body': '我们开发了一套计算方法，在保留高时间分辨率的同时，重建气流脉冲序列中的更多纵向图像细节。',
      'project.corvis.outcome.title': '项目效果',
      'project.corvis.outcome.body': '通过中央角膜厚度测量进行评估后，我们观察到此前未被识别的形变模式，并发现正常组与圆锥角膜组之间存在显著差异（P < 0.01）。',
      'tag.superResolution': '超分辨率',
      'tag.cornealImaging': '角膜成像',
      'tag.timeSeries': '时序分析',
      'tag.clinicalMeasurement': '临床测量',
      'project.choroid.visualAlt': '论文中的 OCT 自动脉络膜分割图。',
      'project.choroid.paperCaption': '图 1 — 自动脉络膜分割',
      'project.choroid.mapLabel': 'DIMS 研究 OCT 分析流程',
      'project.choroid.mapKicker': 'DIMS 研究 / 24 个月随访',
      'project.choroid.mapInput': 'SD-OCT 体数据',
      'project.choroid.mapInputNote': '纵向影像',
      'project.choroid.mapSegmentation': 'CNN 脉络膜与黄斑中心分割',
      'project.choroid.mapSegmentationNote': '自动边界提取',
      'project.choroid.mapMeasurement': '中心凹下脉络膜厚度测量',
      'project.choroid.mapMeasurementNote': '血管与形态指标',
      'project.choroid.mapOutput': '干预反应',
      'project.choroid.eyebrow': '03.02 / 眼科视觉项目',
      'project.choroid.title': '基于深度学习的<br /><i>脉络膜 OCT 分析</i>',
      'project.choroid.close': '关闭脉络膜 OCT 项目',
      'project.choroid.lede': '我们建立了一套 OCT 分析系统，用于量化脉络膜变化，并支持对近视控制干预进行客观评估。',
      'institution.polyu': '香港理工大学',
      'project.choroid.year': '2023',
      'project.choroid.role': '算法设计与数据分析',
      'project.choroid.system.title': '分析系统',
      'project.choroid.system.body': '我们设计了用于脉络膜自动分割和黄斑中心定位的卷积神经网络方法，并加入血管分割与脉络膜血管指数分析模块。',
      'project.choroid.measurements.title': '测量指标',
      'project.choroid.measurements.body': '该流程从 OCT 图像中提取中心凹下脉络膜厚度、血管特征及形态学参数，使纵向治疗效果能够得到一致评估。',
      'project.choroid.outcome.title': '项目效果',
      'project.choroid.outcome.body': '在 DIMS 研究中，干预一周后中心凹下脉络膜厚度增加 6.75 ± 1.52 μm，对照组为 −3.17 ± 1.48 μm（P < 0.0001）；脉络膜变化与眼轴增长呈负相关。',
      'tag.cnnSegmentation': 'CNN 分割',
      'tag.foveaLocalization': '黄斑中心定位',
      'tag.myopiaControl': '近视控制',
      'project.battery.visualAlt': '红色照明下圆形电池极柱的近距离检测图像。',
      'project.battery.mapLabel': '电池极柱检测流程',
      'project.battery.mapKicker': '检测方案',
      'project.battery.mapInput': '极柱 ROI',
      'project.battery.mapInputNote': '中心定位',
      'project.battery.mapNormalize': '径向归一化',
      'project.battery.mapNormalizeNote': '照明校正',
      'project.battery.mapUnwrap': '环形展开',
      'project.battery.mapUnwrapNote': '线性接缝条带',
      'project.battery.mapOutput': '候选异常',
      'project.battery.mapOutputNote': '边缘与纹理证据',
      'project.battery.eyebrow': '04.01 / 工业视觉项目',
      'project.battery.title': '电池极柱<br /><i>检测方案</i>',
      'project.battery.close': '关闭电池极柱项目',
      'project.battery.lede': '我们开发了一套机器视觉方案，用于从电池极柱强烈的同心圆结构中分离局部表面与边缘异常。',
      'project.battery.company': '保密电池制造企业',
      'project.battery.date': '未公开',
      'project.battery.role': '机器视觉工程师',
      'project.battery.overview.title': '项目简介',
      'project.battery.overview.body': '检测样本呈现高对比度的圆形结构，外圈接缝附近存在局部纹理变化。项目的核心挑战是在抑制照明梯度和正常环形边界的同时，保留细微缺陷证据。',
      'project.battery.contribution.title': '我的贡献',
      'project.battery.contribution.body': '我们设计了检测方案和拟采用的流程：定位极柱中心、校正径向照明、将环形区域展开为线性条带，再结合边缘连续性与局部纹理描述子识别候选异常。',
      'project.battery.outcome.title': '项目效果',
      'project.battery.outcome.body': '我们形成了一套可解释的检测方案与验证计划，可结合生产样本、操作员复核和重复性质量决策对缺陷信号进行调优。公开案例省略了量化生产结果与保密实现细节。',
      'tag.roiLocalization': 'ROI 定位',
      'tag.illuminationCorrection': '照明校正',
      'tag.annularUnwrapping': '环形展开',
      'tag.textureAnalysis': '纹理分析',
      'project.source': '阅读论文 ↗',
      'history.close': '关闭教育与经历详情',
      'history.eyebrow': '02.01 / 履历',
      'history.title': '教育 / 经历',
      'history.education': '教育经历',
      'history.polyuCrest': '香港理工大学校徽',
      'history.szuCrest': '深圳大学校徽',
      'history.ysuCrest': '燕山大学校徽',
      'history.hkuCrest': '香港大学校徽',
      'history.phd.role': '博士研究生 · 眼科视光学',
      'history.phd.date': '2021.09 — 至今',
      'location.hongKong': '中国香港',
      'history.supervisor': '导师',
      'history.coSupervisor': '联合导师',
      'history.phd.supervisor': 'Prof. Rachel Ka-Man Chun · 助理教授',
      'history.phd.coSupervisor': 'Chi-Ho To · 讲座教授',
      'history.meng.role': '工学硕士 · 生物医学工程',
      'institution.szu': '深圳大学',
      'location.shenzhen': '中国广东深圳',
      'history.meng.supervisor': 'Yongjin Zhou · 副教授',
      'history.beng.role': '工学学士 · 生物医学工程',
      'institution.ysu': '燕山大学',
      'location.qinhuangdao': '中国河北秦皇岛',
      'history.beng.supervisor': 'Chao Sun · 教授',
      'history.experience': '工作 / 科研经历',
      'history.ra': '科研助理',
      'history.school': '学院',
      'history.school.optometry': '眼科视光学院',
      'history.appointment': '性质',
      'history.fullTime': '全职',
      'institution.hku': '香港大学',
      'history.department': '院系',
      'history.department.eee': '电机电子工程系',
      'history.internship': '实习',
      'skills.close': '关闭技能详情',
      'skills.eyebrow': '02.02 / 履历',
      'skills.title': '技能',
      'skills.computerVision': '计算机视觉 / 深度学习',
      'skills.software': '软件 / 应用开发',
      'skills.embedded': '嵌入式系统',
      'skills.research': '科研 / 数据分析',
      'skills.languages': '语言',
      'skills.languageValues': '普通话（母语）· 英语（熟练）',
      'publications.close': '关闭论文详情',
      'publications.eyebrow': '02.03 / 履历',
      'publications.title': '论文',
      'publications.journals': '期刊论文',
      'publications.conferencePapers': '会议论文',
      'publications.conferenceAbstracts': '会议摘要',
      'publications.doiOpen': '打开论文 DOI（在新标签页中打开）'
    }
  };

  function normalizeLanguage(value) {
    return String(value ?? '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
  }

  function rememberOriginal(element, property, value) {
    const saved = originalValues.get(element) ?? {};
    if (!(property in saved)) saved[property] = value;
    originalValues.set(element, saved);
    return saved[property];
  }

  function applyContent(document, language, selector, keyAttribute, property) {
    document.querySelectorAll(selector).forEach((element) => {
      const original = rememberOriginal(element, property, element[property]);
      const key = element.getAttribute(keyAttribute);
      element[property] = language === 'en' ? original : (translations[language]?.[key] ?? original);
    });
  }

  function applyAttributes(document, language) {
    attributeBindings.forEach(([attribute, keyAttribute]) => {
      document.querySelectorAll(`[${keyAttribute}]`).forEach((element) => {
        const property = `attribute:${attribute}`;
        const original = rememberOriginal(element, property, element.getAttribute(attribute));
        const key = element.getAttribute(keyAttribute);
        element.setAttribute(attribute, language === 'en' ? original : (translations[language]?.[key] ?? original));
      });
    });
  }

  function initializeContactEasterEgg(document) {
    const trigger = document.querySelector('[data-contact-easter-egg-trigger]');
    if (!trigger) return null;

    const originalTitle = trigger.innerHTML;
    let clickCount = 0;
    let lyricIndex = 0;
    let isLocked = false;
    const revealOrRotate = () => {
      if (document.documentElement.lang !== 'zh-CN' || isLocked) return;
      if (clickCount < 5) {
        clickCount += 1;
        if (clickCount < 5) return;
        trigger.textContent = contactEasterEggLyrics[lyricIndex];
        return;
      }
      if (lyricIndex === contactEasterEggLyrics.length - 1) {
        trigger.innerHTML = originalTitle;
        isLocked = true;
        return;
      }
      lyricIndex = (lyricIndex + 1) % contactEasterEggLyrics.length;
      trigger.textContent = contactEasterEggLyrics[lyricIndex];
    };

    trigger.addEventListener('click', revealOrRotate);
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealOrRotate();
      }
    });
    return revealOrRotate;
  }

  function applyLanguage(document, requestedLanguage) {
    const language = normalizeLanguage(requestedLanguage);
    applyContent(document, language, '[data-i18n]', 'data-i18n', 'textContent');
    applyContent(document, language, '[data-i18n-html]', 'data-i18n-html', 'innerHTML');
    applyAttributes(document, language);

    document.documentElement.lang = language;
    document.body.dataset.language = language === 'zh-CN' ? 'zh' : 'en';
    document.querySelectorAll('[data-language-option]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-language-option') === language));
    });

    return language;
  }

  function readStoredLanguage(storage) {
    try {
      return storage?.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function storeLanguage(storage, language) {
    try {
      storage?.setItem(storageKey, language);
    } catch {
      // The switch remains functional when storage is blocked.
    }
  }

  function initializeLanguageSwitcher(document, storage) {
    const initialLanguage = applyLanguage(document, readStoredLanguage(storage));
    if (initializedDocuments.has(document)) return initialLanguage;

    initializedDocuments.add(document);
    const status = document.querySelector('[data-language-status]');
    document.querySelectorAll('[data-language-option]').forEach((button) => {
      button.addEventListener('click', () => {
        const language = applyLanguage(document, button.getAttribute('data-language-option'));
        storeLanguage(storage, language);
        if (status) {
          status.textContent = language === 'zh-CN'
            ? translations['zh-CN']['language.changed.zh']
            : translations['zh-CN']['language.changed.en'];
        }
      });
    });

    return initialLanguage;
  }

  return {
    applyLanguage,
    contactEasterEggLyrics,
    initializeContactEasterEgg,
    initializeLanguageSwitcher,
    normalizeLanguage,
    storageKey,
    translations
  };
});
