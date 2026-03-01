export interface Translation {
    termsTitle: string;
    privacyTitle: string;
    intro: {
        title: string;
        welcome: string;
        agreement: string;
        noAgree: string;
    };
    eligibility: {
        title: string;
        age: string;
        accuracy: string;
        multipleAccounts: string;
    };
    accountSecurity: {
        title: string;
        responsibility: string;
        verification: string;
        notResponsible: string;
    };
    userContent: {
        title: string;
        ownership: string;
        license: string;
        standards: string;
    };
    prohibited: {
        title: string;
        intro: string;
        illegal: string;
        impersonate: string;
        exploit: string;
        spam: string;
        bots: string;
    };
    pagesGroups: {
        title: string;
        create: string;
        moderation: string;
        violations: string;
    };
    monetization: {
        title: string;
        eligibility: string;
        policies: string;
        withhold: string;
    };
    vipBadges: {
        title: string;
        vipPaid: string;
        creatorReview: string;
        revoke: string;
    };
    suspension: {
        title: string;
        intro: string;
        suspendAccounts: string;
        removeContent: string;
        restrictFeatures: string;
        reason: string;
    };
    liability: {
        title: string;
        intro: string;
        dataLoss: string;
        interruptions: string;
        ugcDamages: string;
    };
    termsChanges: {
        title: string;
        update: string;
        reaccept: string;
    };
    governing: {
        title: string;
        text: string;
    };
    contact: {
        title: string;
        email: string;
        company: string;
        language: string;
    };

    // Privacy specific
    infoCollect: {
        title: string;
        intro: string;
        personal: string;
        profile: string;
        content: string;
        messages: string;
        device: string;
    };
    infoUse: {
        title: string;
        intro: string;
        services: string;
        improve: string;
        secure: string;
        monetization: string;
        legal: string;
    };
    cookies: {
        title: string;
        intro: string;
        sessions: string;
        personalize: string;
        analyze: string;
    };
    communications: {
        title: string;
        stored: string;
        protected: string;
    };
    deviceLog: {
        title: string;
        intro: string;
        ip: string;
        deviceType: string;
        os: string;
        loginHistory: string;
    };
    dataSharing: {
        title: string;
        noSell: string;
        payment: string;
        legal: string;
        providers: string;
    };
    dataSecurity: {
        title: string;
        secure: string;
        encryption: string;
        notPerfect: string;
    };
    userRights: {
        title: string;
        intro: string;
        access: string;
        edit: string;
        delete: string;
        export: string;
    };
    dataDeletion: {
        title: string;
        anytime: string;
        retained: string;
    };
    childrenPrivacy: {
        title: string;
        notCollect: string;
        removed: string;
    };
    privacyChanges: {
        title: string;
        update: string;
        notify: string;
    };
    privacyContact: {
        title: string;
        email: string;
        company: string;
        language: string;
    };
}

const en: Translation = {
    termsTitle: 'TERMS & CONDITIONS',
    privacyTitle: 'PRIVACY POLICY',
    intro: {
        title: 'Introduction & Acceptance',
        welcome: 'Welcome to <strong>Femo Space</strong>, a next-generation social media platform operated by <strong>SS Corporate Inc</strong>.',
        agreement: 'By accessing, registering, or using Femo Space (Web, Mobile Apps, PC App), you agree to comply with and be legally bound by these Terms & Conditions.',
        noAgree: 'If you do not agree, you must not use the platform.'
    },
    eligibility: {
        title: 'Eligibility',
        age: 'You must be at least 13 years old (or minimum age required by your country).',
        accuracy: 'By registering, you confirm that all information provided is accurate and lawful.',
        multipleAccounts: 'One user may not operate multiple accounts for malicious purposes.'
    },
    accountSecurity: {
        title: 'Account Registration & Security',
        responsibility: 'You are responsible for safeguarding your login credentials.',
        verification: 'Email and phone verification may be required for security-sensitive actions.',
        notResponsible: 'Femo Space is not responsible for unauthorized access caused by user negligence.'
    },
    userContent: {
        title: 'User Content & Ownership',
        ownership: 'You retain ownership of content you upload.',
        license: 'By posting content, you grant Femo Space a worldwide, non-exclusive license to host, display, distribute, and promote your content within the platform.',
        standards: 'Content must not violate laws, copyrights, or community standards.'
    },
    prohibited: {
        title: 'Prohibited Activities',
        intro: 'Users must NOT:',
        illegal: 'Post illegal, abusive, hateful, or misleading content',
        impersonate: 'Impersonate others',
        exploit: 'Exploit system vulnerabilities',
        spam: 'Spam, scam, or manipulate engagement',
        bots: 'Use bots without permission'
    },
    pagesGroups: {
        title: 'Pages, Groups & Channels',
        create: 'Users may create Pages, Groups, or Channels subject to platform rules.',
        moderation: 'Admins are responsible for moderation.',
        violations: 'Violations may result in suspension or removal.'
    },
    monetization: {
        title: 'Monetization, Ads & Payments',
        eligibility: 'Monetization features are subject to eligibility and verification.',
        policies: 'Revenue sharing, ads, coins, and payouts follow platform policies.',
        withhold: 'Femo Space may withhold payments for fraud or policy violations.'
    },
    vipBadges: {
        title: 'VIP & Creator Badges',
        vipPaid: 'VIP badges are paid features.',
        creatorReview: 'Creator Certified badges are granted after manual review.',
        revoke: 'Badges may be revoked if misuse is detected.'
    },
    suspension: {
        title: 'Account Suspension & Termination',
        intro: 'Femo Space reserves the right to:',
        suspendAccounts: 'Suspend or terminate accounts',
        removeContent: 'Remove content',
        restrictFeatures: 'Restrict features',
        reason: 'if policies are violated or for legal reasons.'
    },
    liability: {
        title: 'Limitation of Liability',
        intro: 'Femo Space is provided "as is." We are not liable for:',
        dataLoss: 'Data loss',
        interruptions: 'Service interruptions',
        ugcDamages: 'User-generated content damages'
    },
    termsChanges: {
        title: 'Changes to Terms',
        update: 'We may update these Terms at any time.',
        reaccept: 'Users may be required to re-accept updated Terms to continue using the platform.'
    },
    governing: {
        title: 'Governing Law',
        text: 'These Terms are governed by the laws applicable to SS Corporate Inc\'s jurisdiction.'
    },
    contact: {
        title: 'Contact',
        email: '📧 Email: legal@femospace.com',
        company: '🏢 Company: SS Corporate Inc',
        language: '🌐 Language:'
    },
    infoCollect: {
        title: 'Information We Collect',
        intro: 'We collect:',
        personal: 'Personal details (name, email, phone)',
        profile: 'Profile information',
        content: 'Content you post',
        messages: 'Messages & interactions',
        device: 'Device & log data'
    },
    infoUse: {
        title: 'How We Use Information',
        intro: 'Your data is used to:',
        services: 'Provide platform services',
        improve: 'Improve user experience',
        secure: 'Secure accounts',
        monetization: 'Enable monetization & payments',
        legal: 'Comply with legal obligations'
    },
    cookies: {
        title: 'Cookies & Tracking',
        intro: 'We use cookies and similar technologies to:',
        sessions: 'Maintain sessions',
        personalize: 'Personalize content',
        analyze: 'Analyze usage'
    },
    communications: {
        title: 'Content & Communications',
        stored: 'Messages and posts may be stored and processed.',
        protected: 'Private communications are protected and not sold.'
    },
    deviceLog: {
        title: 'Device & Log Data',
        intro: 'We may collect:',
        ip: 'IP address',
        deviceType: 'Device type',
        os: 'OS & browser',
        loginHistory: 'Login history'
    },
    dataSharing: {
        title: 'Data Sharing',
        noSell: 'We do NOT sell personal data. Data may be shared only with:',
        payment: 'Payment processors',
        legal: 'Legal authorities (when required)',
        providers: 'Essential service providers'
    },
    dataSecurity: {
        title: 'Data Storage & Security',
        secure: 'Data is securely stored.',
        encryption: 'Industry-standard encryption and protections are used.',
        notPerfect: 'No system is 100% secure.'
    },
    userRights: {
        title: 'User Rights',
        intro: 'You have the right to:',
        access: 'Access your data',
        edit: 'Edit your data',
        delete: 'Delete your account',
        export: 'Request data export (GDPR / CCPA compliant)'
    },
    dataDeletion: {
        title: 'Data Deletion',
        anytime: 'You may delete your account anytime.',
        retained: 'Some data may be retained for legal or security reasons.'
    },
    childrenPrivacy: {
        title: 'Children\'s Privacy',
        notCollect: 'Femo Space does not knowingly collect data from children under the required age.',
        removed: 'Accounts violating this will be removed.'
    },
    privacyChanges: {
        title: 'Changes to Privacy Policy',
        update: 'We may update this policy.',
        notify: 'Significant changes will be notified inside the platform.'
    },
    privacyContact: {
        title: 'Privacy Contact',
        email: '📧 Email: privacy@femospace.com',
        company: '🏢 Company: SS Corporate Inc',
        language: '🌐 Language:'
    }
};

const hi: Translation = {
    termsTitle: 'नियम और शर्तें',
    privacyTitle: 'गोपनीयता नीति',
    intro: {
        title: 'परिचय और स्वीकृति',
        welcome: 'SS Corporate Inc द्वारा संचालित अगली पीढ़ी का सोशल मीडिया प्लेटफॉर्म Femo Space में आपका स्वागत है।',
        agreement: 'Femo Space (वेब, मोबाइल ऐप्स, PC ऐप) तक पहुंचकर, पंजीकरण करके, या उसका उपयोग करके, आप इन नियमों और शर्तों का पालन करने और कानूनी रूप से बाध्य होने के लिए सहमत होते हैं।',
        noAgree: 'यदि आप सहमत नहीं हैं, तो आपको प्लेटफॉर्म का उपयोग नहीं करना चाहिए।'
    },
    eligibility: {
        title: 'पात्रता',
        age: 'आपकी आयु कम से कम 13 वर्ष (या आपके देश द्वारा आवश्यक न्यूनतम आयु) होनी चाहिए।',
        accuracy: 'पंजीकरण करके, आप पुष्टि करते हैं कि प्रदान की गई सभी जानकारी सटीक और कानूनी है।',
        multipleAccounts: 'एक उपयोगकर्ता दुर्भावनापूर्ण उद्देश्यों के लिए कई खाते संचालित नहीं कर सकता।'
    },
    accountSecurity: {
        title: 'खाता पंजीकरण और सुरक्षा',
        responsibility: 'आप अपने लॉगिन क्रेडेंशियल्स की सुरक्षा के लिए जिम्मेदार हैं।',
        verification: 'सुरक्षा-संवेदनशील कार्यों के लिए ईमेल और फोन सत्यापन की आवश्यकता हो सकती है।',
        notResponsible: 'उपयोगकर्ता की लापरवाही के कारण होने वाली अनधिकृत पहुंच के लिए Femo Space जिम्मेदार नहीं है।'
    },
    userContent: {
        title: 'उपयोगकर्ता सामग्री और स्वामित्व',
        ownership: 'आप अपलोड की गई सामग्री का स्वामित्व बनाए रखते हैं।',
        license: 'सामग्री पोस्ट करके, आप Femo Space को अपनी सामग्री को प्लेटफॉर्म के भीतर होस्ट, प्रदर्शित, वितरित और प्रचारित करने के लिए एक विश्वव्यापी, गैर-विशिष्ट लाइसेंस प्रदान करते हैं।',
        standards: 'सामग्री कानूनों, कॉपीराइट या सामुदायिक मानकों का उल्लंघन नहीं करनी चाहिए।'
    },
    prohibited: {
        title: 'निषिद्ध गतिविधियां',
        intro: 'उपयोगकर्ताओं को निम्न नहीं करना चाहिए:',
        illegal: 'अवैध, अपमानजनक, घृणास्पद या भ्रामक सामग्री पोस्ट करना',
        impersonate: 'दूसरों का प्रतिरूपण करना',
        exploit: 'सिस्टम कमजोरियों का शोषण करना',
        spam: 'स्पैम, घोटाले या जुड़ाव में हेरफेर करना',
        bots: 'अनुमति के बिना बॉट्स का उपयोग करना'
    },
    pagesGroups: {
        title: 'पेज, ग्रुप और चैनल',
        create: 'उपयोगकर्ता प्लेटफॉर्म नियमों के अधीन पेज, ग्रुप या चैनल बना सकते हैं।',
        moderation: 'व्यवस्थापक संयमन के लिए जिम्मेदार हैं।',
        violations: 'उल्लंघन के परिणामस्वरूप निलंबन या हटाना हो सकता है।'
    },
    monetization: {
        title: 'मुद्रीकरण, विज्ञापन और भुगतान',
        eligibility: 'मुद्रीकरण सुविधाएं पात्रता और सत्यापन के अधीन हैं।',
        policies: 'राजस्व साझाकरण, विज्ञापन, सिक्के और भुगतान प्लेटफॉर्म नीतियों का पालन करते हैं।',
        withhold: 'Femo Space धोखाधड़ी या नीति उल्लंघन के लिए भुगतान रोक सकता है।'
    },
    vipBadges: {
        title: 'VIP और क्रिएटर बैज',
        vipPaid: 'VIP बैज सशुल्क सुविधाएं हैं।',
        creatorReview: 'क्रिएटर प्रमाणित बैज मैनुअल समीक्षा के बाद प्रदान किए जाते हैं।',
        revoke: 'दुरुपयोग का पता चलने पर बैज रद्द किए जा सकते हैं।'
    },
    suspension: {
        title: 'खाता निलंबन और समाप्ति',
        intro: 'Femo Space निम्नलिखित अधिकार सुरक्षित रखता है:',
        suspendAccounts: 'खातों को निलंबित या समाप्त करना',
        removeContent: 'सामग्री हटाना',
        restrictFeatures: 'सुविधाओं को प्रतिबंधित करना',
        reason: 'यदि नीतियों का उल्लंघन किया जाता है या कानूनी कारणों से।'
    },
    liability: {
        title: 'देयता की सीमा',
        intro: 'Femo Space "जैसा है" प्रदान किया जाता है। हम निम्न के लिए उत्तरदायी नहीं हैं:',
        dataLoss: 'डेटा हानि',
        interruptions: 'सेवा में रुकावट',
        ugcDamages: 'उपयोगकर्ता-जनित सामग्री क्षति'
    },
    termsChanges: {
        title: 'नियमों में परिवर्तन',
        update: 'हम किसी भी समय इन नियमों को अपडेट कर सकते हैं।',
        reaccept: 'प्लेटफॉर्म का उपयोग जारी रखने के लिए उपयोगकर्ताओं को अपडेट किए गए नियमों को फिर से स्वीकार करने की आवश्यकता हो सकती है।'
    },
    governing: {
        title: 'शासी कानून',
        text: 'ये नियम SS Corporate Inc के अधिकार क्षेत्र में लागू कानूनों द्वारा नियंत्रित होते हैं।'
    },
    contact: {
        title: 'संपर्क',
        email: '📧 ईमेल: legal@femospace.com',
        company: '🏢 कंपनी: SS Corporate Inc',
        language: '🌐 भाषा:'
    },
    infoCollect: {
        title: 'हम जो जानकारी एकत्र करते हैं',
        intro: 'हम एकत्र करते हैं:',
        personal: 'व्यक्तिगत विवरण (नाम, ईमेल, फोन)',
        profile: 'प्रोफ़ाइल जानकारी',
        content: 'आपके द्वारा पोस्ट की गई सामग्री',
        messages: 'संदेश और इंटरैक्शन',
        device: 'डिवाइस और लॉग डेटा'
    },
    infoUse: {
        title: 'हम जानकारी का उपयोग कैसे करते हैं',
        intro: 'आपका डेटा इसके लिए उपयोग किया जाता है:',
        services: 'प्लेटफॉर्म सेवाएं प्रदान करना',
        improve: 'उपयोगकर्ता अनुभव में सुधार करना',
        secure: 'खातों को सुरक्षित करना',
        monetization: 'मुद्रीकरण और भुगतान सक्षम करना',
        legal: 'कानूनी दायित्वों का पालन करना'
    },
    cookies: {
        title: 'कुकीज़ और ट्रैकिंग',
        intro: 'हम कुकीज़ और समान तकनीकों का उपयोग करते हैं:',
        sessions: 'सत्र बनाए रखना',
        personalize: 'सामग्री को वैयक्तिकृत करना',
        analyze: 'उपयोग का विश्लेषण करना'
    },
    communications: {
        title: 'सामग्री और संचार',
        stored: 'संदेश और पोस्ट संग्रहीत और संसाधित किए जा सकते हैं।',
        protected: 'निजी संचार सुरक्षित हैं और बेचे नहीं जाते।'
    },
    deviceLog: {
        title: 'डिवाइस और लॉग डेटा',
        intro: 'हम एकत्र कर सकते हैं:',
        ip: 'IP पता',
        deviceType: 'डिवाइस प्रकार',
        os: 'OS और ब्राउज़र',
        loginHistory: 'लॉगिन इतिहास'
    },
    dataSharing: {
        title: 'डेटा साझाकरण',
        noSell: 'हम व्यक्तिगत डेटा नहीं बेचते हैं। डेटा केवल इनके साथ साझा किया जा सकता है:',
        payment: 'भुगतान प्रोसेसर',
        legal: 'कानूनी अधिकारी (जब आवश्यक हो)',
        providers: 'आवश्यक सेवा प्रदाता'
    },
    dataSecurity: {
        title: 'डेटा भंडारण और सुरक्षा',
        secure: 'डेटा सुरक्षित रूप से संग्रहीत है।',
        encryption: 'उद्योग-मानक एन्क्रिप्शन और सुरक्षा का उपयोग किया जाता है।',
        notPerfect: 'कोई भी सिस्टम 100% सुरक्षित नहीं है।'
    },
    userRights: {
        title: 'उपयोगकर्ता अधिकार',
        intro: 'आपको अधिकार है:',
        access: 'अपने डेटा तक पहुंचने का',
        edit: 'अपने डेटा को संपादित करने का',
        delete: 'अपना खाता हटाने का',
        export: 'डेटा निर्यात का अनुरोध करने का (GDPR / CCPA अनुपालन)'
    },
    dataDeletion: {
        title: 'डेटा विलोपन',
        anytime: 'आप किसी भी समय अपना खाता हटा सकते हैं।',
        retained: 'कुछ डेटा कानूनी या सुरक्षा कारणों से बनाए रखा जा सकता है।'
    },
    childrenPrivacy: {
        title: 'बच्चों की गोपनीयता',
        notCollect: 'Femo Space जानबूझकर आवश्यक आयु से कम बच्चों से डेटा एकत्र नहीं करता है।',
        removed: 'इसका उल्लंघन करने वाले खाते हटा दिए जाएंगे।'
    },
    privacyChanges: {
        title: 'गोपनीयता नीति में परिवर्तन',
        update: 'हम इस नीति को अपडेट कर सकते हैं।',
        notify: 'महत्वपूर्ण परिवर्तनों की सूचना प्लेटफॉर्म के अंदर दी जाएगी।'
    },
    privacyContact: {
        title: 'गोपनीयता संपर्क',
        email: '📧 ईमेल: privacy@femospace.com',
        company: '🏢 कंपनी: SS Corporate Inc',
        language: '🌐 भाषा:'
    }
};

const es: Translation = {
    ...en,
    termsTitle: 'TÉRMINOS Y CONDICIONES',
    privacyTitle: 'POLÍTICA DE PRIVACIDAD',
    intro: {
        title: 'Introducción y Aceptación',
        welcome: 'Bienvenido a <strong>Femo Space</strong>, una plataforma operada por <strong>SS Corporate Inc</strong>.',
        agreement: 'Al acceder o usar Femo Space, acepta estos Términos.',
        noAgree: 'Si no está de acuerdo, no use la plataforma.'
    },
    eligibility: {
        title: 'Elegibilidad',
        age: 'Debe tener al menos 13 años.',
        accuracy: 'La información proporcionada debe ser precisa.',
        multipleAccounts: 'No se permiten múltiples cuentas maliciosas.'
    },
    accountSecurity: {
        title: 'Seguridad de la Cuenta',
        responsibility: 'Usted es responsable de sus credenciales.',
        verification: 'Se puede requerir verificación.',
        notResponsible: 'Femo Space no es responsable por acceso no autorizado.'
    },
    contact: {
        title: 'Contacto',
        email: '📧 Correo: legal@femospace.com',
        company: '🏢 Empresa: SS Corporate Inc',
        language: '🌐 Idioma:'
    }
};

const zhCN: Translation = {
    ...en,
    termsTitle: '条款和条件',
    privacyTitle: '隐私政策',
    intro: {
        title: '介绍与接受',
        welcome: '欢迎来到 <strong>Femo Space</strong>，由 <strong>SS Corporate Inc</strong> 运营。',
        agreement: '访问或使用 Femo Space 即表示您同意这些条款。',
        noAgree: '如果您不同意，请勿使用。'
    },
    eligibility: {
        title: '资格',
        age: '您必须年满 13 岁。',
        accuracy: '信息必须准确。',
        multipleAccounts: '禁止恶意多账户。'
    },
    contact: {
        title: '联系方式',
        email: '📧 邮箱: legal@femospace.com',
        company: '🏢 公司: SS Corporate Inc',
        language: '🌐 语言:'
    }
};

// ... Add similar comprehensive objects for other languages if needed
// For brevity in this file, we fallback to English content but with translated titles where available

export const TRANSLATIONS: { [key: string]: Translation } = {
    en: en,
    hi: hi,
    es: es,
    'zh-CN': zhCN,
    ar: {
        ...en,
        termsTitle: 'الشروط والأحكام',
        privacyTitle: 'سياسة الخصوصية',
        intro: {
            title: 'المقدمة والقبول',
            welcome: 'مرحبًا بك في <strong>Femo Space</strong>، منصة وسائل التواصل الاجتماعي من الجيل التالي التي تديرها <strong>SS Corporate Inc</strong>.',
            agreement: 'من خلال الوصول أو التسجيل أو استخدام Femo Space (الويب وتطبيقات الهاتف المحمول وتطبيق الكمبيوتر)، فإنك توافق على الالتزام والالتزام قانونيًا بهذه الشروط والأحكام.',
            noAgree: 'إذا كنت لا توافق، يجب عليك عدم استخدام المنصة.'
        },
        eligibility: {
            title: 'الأهلية',
            age: 'يجب أن يكون عمرك 13 عامًا على الأقل (أو الحد الأدنى للعمر المطلوب في بلدك).',
            accuracy: 'بالتسجيل، فإنك تؤكد أن جميع المعلومات المقدمة دقيقة وقانونية.',
            multipleAccounts: 'لا يجوز للمستخدم تشغيل حسابات متعددة لأغراض خبيثة.'
        }
    },
    bn: {
        ...en,
        termsTitle: 'নিয়ম ও শর্তাবলী',
        privacyTitle: 'গোপনীয়তা নীতি',
        intro: {
            title: 'ভূমিকা এবং গ্রহণযোগ্যতা',
            welcome: '<strong>SS Corporate Inc</strong> দ্বারা পরিচালিত পরবর্তী প্রজন্মের সোশ্যাল মিডিয়া প্ল্যাটফর্ম <strong>Femo Space</strong>-এ স্বাগতম।',
            agreement: 'Femo Space (ওয়েব, মোবাইল অ্যাপ্স, পিসি অ্যাপ) অ্যাক্সেস, নিবন্ধন বা ব্যবহার করার মাধ্যমে, আপনি এই নিয়ম ও শর্তাবলী মেনে চলতে এবং আইনগতভাবে বাধ্য হতে সম্মত হন।',
            noAgree: 'যদি আপনি সম্মত না হন, তাহলে আপনাকে প্ল্যাটফর্মটি ব্যবহার করা উচিত নয়।'
        },
        eligibility: {
            title: 'যোগ্যতা',
            age: 'আপনার বয়স কমপক্ষে 13 বছর (বা আপনার দেশের প্রয়োজনীয় ন্যূনতম বয়স) হতে হবে।',
            accuracy: 'নিবন্ধন করার মাধ্যমে, আপনি নিশ্চিত করছেন যে প্রদত্ত সমস্ত তথ্য সঠিক এবং আইনসম্মত।',
            multipleAccounts: 'একজন ব্যবহারকারী দুর্দান্ত উদ্দেশ্যে একাধিক অ্যাকাউন্ট পরিচালনা করতে পারবেন না।'
        }
    },
    pt: {
        ...en,
        termsTitle: 'TERMOS E CONDIÇÕES',
        privacyTitle: 'POLÍTICA DE PRIVACIDADE',
        intro: {
            title: 'Introdução e Aceitação',
            welcome: 'Bem-vindo ao <strong>Femo Space</strong>, uma plataforma de mídia social de última geração operada pela <strong>SS Corporate Inc</strong>.',
            agreement: 'Ao acessar, registrar-se ou usar o Femo Space (Web, Aplicativos Móveis, Aplicativo PC), você concorda em cumprir e estar legalmente vinculado a estes Termos e Condições.',
            noAgree: 'Se você não concordar, não deve usar a plataforma.'
        },
        eligibility: {
            title: 'Elegibilidade',
            age: 'Você deve ter pelo menos 13 anos (ou a idade mínima exigida pelo seu país).',
            accuracy: 'Ao se registrar, você confirma que todas as informações fornecidas são precisas e legais.',
            multipleAccounts: 'Um usuário não pode operar várias contas para fins maliciosos.'
        }
    },
    ru: {
        ...en,
        termsTitle: 'УСЛОВИЯ И ПОЛОЖЕНИЯ',
        privacyTitle: 'ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ',
        intro: {
            title: 'Введение и принятие',
            welcome: 'Добро пожаловать в <strong>Femo Space</strong>, социальную сеть нового поколения, управляемую <strong>SS Corporate Inc</strong>.',
            agreement: 'Получая доступ, регистрируясь или используя Femo Space (Веб, Мобильные Приложения, ПК Приложение), вы соглашаетесь соблюдать и быть юридически связанными этими Условиями и Положениями.',
            noAgree: 'Если вы не согласны, вы не должны использовать платформу.'
        },
        eligibility: {
            title: 'Право доступа',
            age: 'Вам должно быть не менее 13 лет (или минимальный возраст, требуемый вашей страной).',
            accuracy: 'Регистрируясь, вы подтверждаете, что вся предоставленная информация является точной и законной.',
            multipleAccounts: 'Один пользователь не может управлять несколькими учетными записями в злонамеренных целях.'
        }
    },
    ja: {
        ...en,
        termsTitle: '利用規約',
        privacyTitle: 'プライバシーポリシー',
        intro: {
            title: '紹介と承諾',
            welcome: '<strong>SS Corporate Inc</strong>が運営する次世代ソーシャルメディアプラットフォーム<strong>Femo Space</strong>へようこそ。',
            agreement: 'Femo Space（Web、モバイルアプリ、PCアプリ）にアクセス、登録、または使用することにより、これらの利用規約に従い法的に拘束されることに同意します。',
            noAgree: '同意しない場合は、プラットフォームを使用しないでください。'
        },
        eligibility: {
            title: '資格',
            age: '13歳以上（またはあなたの国で必要な最低年齢）である必要があります。',
            accuracy: '登録することにより、提供されたすべての情報が正確で合法であることを確認します。',
            multipleAccounts: '1人のユーザーが悪意のある目的で複数のアカウントを操作することはできません。'
        }
    },
    de: {
        ...en,
        termsTitle: 'GESCHÄFTSBEDINGUNGEN',
        privacyTitle: 'DATENSCHUTZRICHTLINIE',
        intro: {
            title: 'Einführung und Akzeptanz',
            welcome: 'Willkommen bei <strong>Femo Space</strong>, einer Social-Media-Plattform der nächsten Generation, die von <strong>SS Corporate Inc</strong> betrieben wird.',
            agreement: 'Durch den Zugriff auf, die Registrierung bei oder die Nutzung von Femo Space (Web, Mobile Apps, PC App) stimmen Sie zu, diese Geschäftsbedingungen einzuhalten und rechtlich daran gebunden zu sein.',
            noAgree: 'Wenn Sie nicht einverstanden sind, dürfen Sie die Plattform nicht nutzen.'
        },
        eligibility: {
            title: 'Berechtigung',
            age: 'Sie müssen mindestens 13 Jahre alt sein (oder das in Ihrem Land erforderliche Mindestalter).',
            accuracy: 'Durch die Registrierung bestätigen Sie, dass alle bereitgestellten Informationen korrekt und rechtmäßig sind.',
            multipleAccounts: 'Ein Benutzer darf nicht mehrere Konten für böswillige Zwecke betreiben.'
        }
    },
    fr: {
        ...en,
        termsTitle: 'CONDITIONS GÉNÉRALES',
        privacyTitle: 'POLITIQUE DE CONFIDENTIALITÉ',
        intro: {
            title: 'Introduction et Acceptation',
            welcome: 'Bienvenue sur <strong>Femo Space</strong>, une plateforme de médias sociaux de nouvelle génération exploitée par <strong>SS Corporate Inc</strong>.',
            agreement: 'En accédant, en vous inscrivant ou en utilisant Femo Space (Web, Applications Mobiles, Application PC), vous acceptez de vous conformer et d\'être légalement lié par ces Conditions Générales.',
            noAgree: 'Si vous n\'êtes pas d\'accord, vous ne devez pas utiliser la plateforme.'
        },
        eligibility: {
            title: 'Éligibilité',
            age: 'Vous devez avoir au moins 13 ans (ou l\'âge minimum requis par votre pays).',
            accuracy: 'En vous inscrivant, vous confirmez que toutes les informations fournies sont exactes et légales.',
            multipleAccounts: 'Un utilisateur ne peut pas gérer plusieurs comptes à des fins malveillantes.'
        }
    },
    ko: {
        ...en,
        termsTitle: '이용약관',
        privacyTitle: '개인정보 보호정책',
        intro: {
            title: '소개 및 수락',
            welcome: '<strong>SS Corporate Inc</strong>에서 운영하는 차세대 소셜 미디어 플랫폼 <strong>Femo Space</strong>에 오신 것을 환영합니다.',
            agreement: 'Femo Space(웹, 모바일 앱, PC 앱)에 액세스하거나 등록하거나 사용함으로써 귀하는 본 이용약관을 준수하고 법적으로 구속되는 데 동의합니다.',
            noAgree: '동의하지 않으면 플랫폼을 사용해서는 안 됩니다.'
        },
        eligibility: {
            title: '자격',
            age: '최소 13세 이상(또는 귀하의 국가에서 요구하는 최소 연령)이어야 합니다.',
            accuracy: '등록함으로써 제공된 모든 정보가 정확하고 합법적임을 확인합니다.',
            multipleAccounts: '한 사용자가 악의적인 목적으로 여러 계정을 운영할 수 없습니다.'
        }
    },
    it: {
        ...en,
        termsTitle: 'TERMINI E CONDIZIONI',
        privacyTitle: 'POLITICA SULLA PRIVACY',
        intro: {
            title: 'Introduzione e Accettazione',
            welcome: 'Benvenuto su <strong>Femo Space</strong>, una piattaforma di social media di nuova generazione gestita da <strong>SS Corporate Inc</strong>.',
            agreement: 'Accedendo, registrandoti o utilizzando Femo Space (Web, App Mobili, App PC), accetti di rispettare ed essere legalmente vincolato da questi Termini e Condizioni.',
            noAgree: 'Se non sei d\'accordo, non devi utilizzare la piattaforma.'
        },
        eligibility: {
            title: 'Idoneità',
            age: 'Devi avere almeno 13 anni (o l\'età minima richiesta dal tuo paese).',
            accuracy: 'Registrandoti, confermi che tutte le informazioni fornite sono accurate e legali.',
            multipleAccounts: 'Un utente non può gestire più account per scopi dannosi.'
        }
    },
    tr: {
        ...en,
        termsTitle: 'ŞARTLAR VE KOŞULLAR',
        privacyTitle: 'GİZLİLİK POLİTİKASI',
        intro: {
            title: 'Giriş ve Kabul',
            welcome: '<strong>SS Corporate Inc</strong> tarafından işletilen yeni nesil sosyal medya platformu <strong>Femo Space</strong>\'e hoş geldiniz.',
            agreement: 'Femo Space\'e (Web, Mobil Uygulamalar, PC Uygulaması) erişerek, kaydolarak veya kullanarak, bu Şartlar ve Koşullar\'a uymayı ve yasal olarak bağlı olmayı kabul edersiniz.',
            noAgree: 'Kabul etmiyorsanız, platformu kullanmamalısınız.'
        },
        eligibility: {
            title: 'Uygunluk',
            age: 'En az 13 yaşında olmalısınız (veya ülkenizin gerektirdiği minimum yaş).',
            accuracy: 'Kaydolarak, sağlanan tüm bilgilerin doğru ve yasal olduğunu onaylarsınız.',
            multipleAccounts: 'Bir kullanıcı kötü niyetli amaçlar için birden fazla hesap işletemez.'
        }
    },
    'zh-TW': {
        ...en,
        termsTitle: '條款和條件',
        privacyTitle: '隱私政策',
        intro: {
            title: '介紹與接受',
            welcome: '歡迎來到由 <strong>SS Corporate Inc</strong> 營運的下一代社交媒體平台 <strong>Femo Space</strong>。',
            agreement: '通過訪問、註冊或使用 Femo Space（網頁版、移動應用、PC應用），您同意遵守並受這些條款和條件的法律約束。',
            noAgree: '如果您不同意，您不得使用該平台。'
        }
    },
    vi: {
        ...en,
        termsTitle: 'ĐIỀU KHOẢN & ĐIỀU KIỆN',
        privacyTitle: 'CHÍNH SÁCH BẢO MẬT',
        intro: {
            title: 'Giới thiệu & Chấp nhận',
            welcome: 'Chào mừng bạn đến với <strong>Femo Space</strong>, nền tảng mạng xã hội thế hệ tiếp theo được vận hành bởi <strong>SS Corporate Inc</strong>.',
            agreement: 'Bằng cách truy cập, đăng ký hoặc sử dụng Femo Space, bạn đồng ý tuân thủ các Điều khoản & Điều kiện này.',
            noAgree: 'Nếu bạn không đồng ý, bạn không được sử dụng nền tảng này.'
        }
    },
    th: {
        ...en,
        termsTitle: 'ข้อกำหนดและเงื่อนไข',
        privacyTitle: 'นโยบายความเป็นส่วนตัว',
        intro: {
            title: 'บทนำและการยอมรับ',
            welcome: 'ยินดีต้อนรับสู่ <strong>Femo Space</strong> ยุคใหม่ของโซเชียลมีเดีย',
            agreement: 'โดยการเข้าถึงหรือใช้งาน คุณตกลงที่จะปฏิบัติตามข้อกำหนดเหล่านี้',
            noAgree: 'หากคุณไม่เห็นด้วย โปรดอย่าใช้งานแพลตฟอร์ม'
        }
    },
    id: {
        ...en,
        termsTitle: 'SYARAT & KETENTUAN',
        privacyTitle: 'KEBIJAKAN PRIVASI',
        intro: {
            title: 'Pengantar & Penerimaan',
            welcome: 'Selamat datang di <strong>Femo Space</strong>, platform media sosial generasi berikutnya.',
            agreement: 'Dengan mengakses atau menggunakan Femo Space, Anda menyetujui Syarat & Ketentuan ini.',
            noAgree: 'Jika Anda tidak setuju, jangan gunakan platform ini.'
        }
    },
    pl: {
        ...en,
        termsTitle: 'REGULAMIN',
        privacyTitle: 'POLITYKA PRYWATNOŚCI',
        intro: {
            title: 'Wstęp i Akceptacja',
            welcome: 'Witamy w <strong>Femo Space</strong>.',
            agreement: 'Rejestrując się, akceptujesz niniejszy Regulamin.',
            noAgree: 'Jeśli się nie zgadzasz, nie używaj platformy.'
        }
    },
    uk: {
        ...en,
        termsTitle: 'УМОВИ ТА ПОЛОЖЕННЯ',
        privacyTitle: 'ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ',
        intro: {
            title: 'Вступ та прийняття',
            welcome: 'Ласкаво просимо до <strong>Femo Space</strong>.',
            agreement: 'Користуючись платформою, ви погоджуєтесь з цими Умовами.',
            noAgree: 'Якщо ви не згодні, не використовуйте платформу.'
        }
    },
    nl: {
        ...en,
        termsTitle: 'ALGEMENE VOORWAARDEN',
        privacyTitle: 'PRIVACYBELEID',
        intro: {
            title: 'Inleiding & Acceptatie',
            welcome: 'Welkom bij <strong>Femo Space</strong>.',
            agreement: 'Door gebruik te maken van het platform gaat u akkoord met deze voorwaarden.',
            noAgree: 'Als u niet akkoord gaat, gebruik het platform dan niet.'
        }
    },
    sv: {
        ...en,
        termsTitle: 'VILLKOR',
        privacyTitle: 'INTEGRITETSPOLICY',
        intro: {
            title: 'Introduktion & Godkännande',
            welcome: 'Välkommen till <strong>Femo Space</strong>.',
            agreement: 'Genom att använda plattformen godkänner du dessa villkor.',
            noAgree: 'Om du inte godkänner, använd inte plattformen.'
        }
    },
    he: {
        ...en,
        termsTitle: 'תנאים והגבלות',
        privacyTitle: 'מדיניות פרטיות',
        intro: {
            title: 'מבוא וקבלה',
            welcome: 'ברוכים הבאים ל-<strong>Femo Space</strong>.',
            agreement: 'על ידי שימוש בפלטפורמה, אתה מסכים לתנאים אלה.',
            noAgree: 'אם אינך מסכים, אל תשתמש בפלטפורמה.'
        }
    },
    el: {
        ...en,
        termsTitle: 'ΟΡΟΙ & ΠΡΟΫΠΟΘΕΣΕΙΣ',
        privacyTitle: 'ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ',
        intro: {
            title: 'Εισαγωγή & Αποδοχή',
            welcome: 'Καλώς ορίσατε στο <strong>Femo Space</strong>.',
            agreement: 'Χρησιμοποιώντας την πλατφόρμα, συμφωνείτε με αυτούς τους Όρους.',
            noAgree: 'Εάν δεν συμφωνείτε, μην χρησιμοποιείτε την πλατφόρμα.'
        }
    },
    cs: {
        ...en,
        termsTitle: 'OBCHODNÍ PODMÍNKY',
        privacyTitle: 'ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ',
        intro: {
            title: 'Úvod a přijetí',
            welcome: 'Vítejte v <strong>Femo Space</strong>.',
            agreement: 'Používáním platformy souhlasíte s těmito podmínkami.',
            noAgree: 'Pokud nesouhlasíte, nepoužívejte platformu.'
        }
    },
    ro: {
        ...en,
        termsTitle: 'TERMENI ȘI CONDIȚII',
        privacyTitle: 'POLITICA DE CONFIDENȚIALITATE',
        intro: {
            title: 'Introducere și Acceptare',
            welcome: 'Bine ați venit la <strong>Femo Space</strong>.',
            agreement: 'Prin utilizarea platformei, sunteți de acord cu acești Termeni.',
            noAgree: 'Dacă nu sunteți de acord, nu utilizați platforma.'
        }
    },
    hu: {
        ...en,
        termsTitle: 'FELHASZNÁLÁSI FELTÉTELEK',
        privacyTitle: 'ADATVÉDELMI IRÁNYELVEK',
        intro: {
            title: 'Bevezetés és Elfogadás',
            welcome: 'Üdvözli a <strong>Femo Space</strong>.',
            agreement: 'A platform használatával elfogadja ezeket a feltételeket.',
            noAgree: 'Ha nem ért egyet, ne használja a platformot.'
        }
    },
    fi: {
        ...en,
        termsTitle: 'KÄYTTÖEHDOT',
        privacyTitle: 'TIETOSUOJAKÄYTÄNTÖ',
        intro: {
            title: 'Johdanto ja Hyväksyminen',
            welcome: 'Tervetuloa <strong>Femo Space</strong> -alustalle.',
            agreement: 'Käyttämällä alustaa hyväksyt nämä ehdot.',
            noAgree: 'Jos et hyväksy, älä käytä alustaa.'
        }
    },
    da: {
        ...en,
        termsTitle: 'VILKÅR OG BETINGELSER',
        privacyTitle: 'PRIVATLIVSPOLITIK'
    },
    no: {
        ...en,
        termsTitle: 'VILKÅR OG BETINGELSER',
        privacyTitle: 'PERSONVERNERKLÆRING'
    },
    ms: {
        ...en,
        termsTitle: 'TERMA & SYARAT',
        privacyTitle: 'DASAR PRIVASI'
    }
};
