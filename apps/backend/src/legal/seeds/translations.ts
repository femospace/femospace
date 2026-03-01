// Complete translations for all major languages
// This file contains professional translations for legal documents

export interface Translation {
    termsTitle: string;
    privacyTitle: string;
    lastUpdated: string;
    version: string;
    section1Title: string;
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
    section2Title: string;
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

export const TRANSLATIONS: { [key: string]: Translation } = {
    en: {
        termsTitle: 'TERMS & CONDITIONS',
        privacyTitle: 'PRIVACY POLICY',
        lastUpdated: 'Last Updated',
        version: 'Version',
        section1Title: 'SECTION 1 — TERMS & CONDITIONS',
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
        section2Title: 'SECTION 2 — PRIVACY POLICY',
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
    },

    hi: {
        termsTitle: 'नियम और शर्तें',
        privacyTitle: 'गोपनीयता नीति',
        lastUpdated: 'अंतिम अपडेट',
        version: 'संस्करण',
        section1Title: 'खंड 1 — नियम और शर्तें',
        intro: {
            title: 'परिचय और स्वीकृति',
            welcome: '<strong>SS Corporate Inc</strong> द्वारा संचालित अगली पीढ़ी का सोशल मीडिया प्लेटफॉर्म <strong>Femo Space</strong> में आपका स्वागत है।',
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
        section2Title: 'खंड 2 — गोपनीयता नीति',
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
    }
};

// This will be expanded with all languages
// For languages not yet translated, we'll use English as fallback
export function getTranslation(lang: string): Translation {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
