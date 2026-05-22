const fs = require('fs');
const i18nPath = './apps/web/src/i18n.ts';
let content = fs.readFileSync(i18nPath, 'utf-8');

const masterEn = {
  'welcome': {
    'title': 'Welcome to Femo Space',
    'tagline': 'Connect, Create, Earn – New Gen Social Experience',
    'login': 'Login',
    'register': 'Register',
    'switchToEnglish': 'Switch to English'
  },
  'auth': {
    'login': {
      'title': 'Welcome Back',
      'subtitle': 'Login to your Femo Space account',
      'identifierLabel': 'Email, Femo ID or Mail',
      'identifierLabelId': 'Femo ID',
      'identifierLabelMail': 'Femo Mail',
      'identifierPlaceholder': 'Enter your credentials',
      'passwordLabel': 'Password',
      'passwordPlaceholder': 'Enter your password',
      'submit': 'Login',
      'submitting': 'Logging in...',
      'forgotPassword': 'Forgot password?',
      'signUp': 'Create an account',
      'alreadyHaveAccount': 'Already have an account?',
      'errors': {
        'identifierRequired': 'Identifier is required',
        'identifierInvalid': 'Please enter a valid Email, Femo ID or Mail',
        'passwordRequired': 'Password is required',
        'unverified': 'Email not verified. Please check your inbox.',
        'locked': 'Account temporarily locked. Try again later.',
        'blocked': 'Account has been blocked.',
        'invalid': 'Invalid identifier or password'
      },
      'securityInfo': {
        'encrypted': '256-bit AES Encryption',
        'rateLimited': 'Protected by Brute-Force Shield'
      }
    },
    'register': {
      'identity': {
        'title': 'Create Identity',
        'subtitle': 'Let us know who you are',
        'stepInfo': 'Identity',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'birthday': 'Birthday',
        'gender': 'Gender',
        'placeholder': {
          'firstName': 'First name',
          'lastName': 'Last name'
        },
        'errors': {
          'firstName': 'First name is required',
          'lastName': 'Last name is required',
          'birthday': 'Birthday is required',
          'age': 'You must be at least 13 years old',
          'failed': 'Failed to proceed. Try again.'
        },
        'next': 'Next Step',
        'idInfo': 'Auto-generated, read-only, permanent'
      },
      'credentials': {
        'title': 'Credentials',
        'subtitle': 'Secure your account',
        'email': 'Email Address',
        'password': 'Password',
        'confirmPassword': 'Confirm Password',
        'country': 'Country',
        'terms': 'I accept the Terms & Conditions',
        'privacy': 'I accept the Privacy Policy',
        'back': 'Back',
        'submit': 'Finalize',
        'placeholder': {
          'email': 'your@email.com',
          'username': 'username',
          'phone': '1234567890'
        },
        'errors': {
          'emailTaken': 'Email is already taken',
          'emailInvalid': 'Invalid email format',
          'emailRequired': 'Email is required',
          'passwordRequired': 'Password is required',
          'passwordComplex': 'Password must be stronger',
          'passwordShort': 'Minimum 8 characters required',
          'confirmRequired': 'Please confirm your password',
          'match': 'Passwords do not match',
          'country': 'Please select your country',
          'terms': 'Required',
          'privacy': 'Required',
          'failed': 'Registration failed'
        },
        'phoneNumber': 'Phone Number (Optional)'
      },
      'steps': {
        'finalize': 'Finalize Your Account'
      },
      'verification': {
        'title': 'Verify Your Email',
        'subtitle': 'Enter the 6-digit code sent to',
        'inputLabel': 'Verification Code',
        'verifyButton': 'Verify Code',
        'resendButton': 'Resend Code',
        'noEmail': "Didn't receive an email?",
        'success': 'Email verified successfully!',
        'errors': {
          'invalid': 'Invalid verification code'
        }
      }
    },
    'forgotPassword': {
      'title': 'Reset Password',
      'subtitle': 'Recover access to your account',
      'submit': 'Send Reset Code',
      'backToLogin': 'Back to Login',
      'successSubtitle': 'Password reset successful. You can now',
      'errors': {
        'failed': 'Failed to request reset'
      }
    },
    'password': {
      'strength': 'Strength',
      'scores': {
        'tooWeak': 'Too Weak',
        'weak': 'Weak',
        'fair': 'Fair',
        'good': 'Good',
        'strong': 'Strong',
        'veryStrong': 'Very Strong'
      }
    },
    'gender': {
      'male': 'Male',
      'female': 'Female',
      'nonBinary': 'Non-binary',
      'other': 'Other',
      'preferNotToSay': 'Prefer not to say'
    }
  },
  'common': {
    'loading': 'Loading...',
    'checking': 'Checking...',
    'available': 'Available',
    'suggestions': 'Suggestions',
    'accountSummary': 'Account Summary:',
    'sending': 'Sending code...',
    'verifying': 'Verifying...',
    'resetting': 'Resetting...',
    'retry': 'Retry',
    'viewAll': 'View All',
    'recent': 'Recent',
    'follow': 'Follow',
    'join': 'Join',
    'status': 'Status',
    'settings': 'Settings',
    'high': 'High',
    'viewHistory': 'View History',
    'video': 'Video',
    'reel': 'Reel',
    'post': 'Post',
    'published': 'Published',
    'create': 'Create',
    'searchContent': 'Search content...',
    'content': 'Content',
    'type': 'Type',
    'date': 'Date',
    'revenue': 'Revenue',
    'underConstruction': 'Module {{module}} is under construction.',
    'last28Days': 'Last 28 Days',
    'creator': 'Creator',
    'likes': 'likes',
    'status_draft': 'Draft',
    'times': {
      '2h_ago': '2 hours ago',
      'yesterday': 'Yesterday',
      '2d_ago': '2 days ago',
      'draft': 'Draft'
    },
    'error': {
      'title': 'Something went wrong'
    }
  },
  'home': {
    'yourSpace': 'Your Space',
    'popularSpaces': 'Popular Spaces',
    'forYou': 'For You',
    'following': 'Following',
    'trending': 'Trending',
    'personalizing': 'Personalizing your feed...',
    'welcomeNewSpace': 'Welcome to your new space!',
    'newSpaceSubtitle': 'This is where your universe lives. Post something above to see it saved here forever.',
    'startPosting': 'Start Posting',
    'proTip': 'Pro Tip: 🚀',
    'proTipDesc': 'You can share photos, videos, and even AI-generated thoughts. Everything you post is securely saved to your FEMO SPACE account.',
    'whoToFollow': 'Who to follow',
    'welcome': 'Welcome back, {{name}}!',
    'feedSubtitle': 'This is your protected news feed area.',
    'logout': 'Logout',
    'feedPlaceholder': 'Content will appear here...'
  },
  'video': {
    'reels': 'Reels',
    'videos': 'Videos',
    'live': 'Live',
    'goLive': 'Go Live',
    'upload': 'Upload',
    'noContent': 'No content found',
    'noContentSubtitle': 'There are no {{type}} available at the moment.',
    'follow': 'Follow',
    'originalAudio': 'Original Audio',
    'views': 'views',
    'watching': 'watching',
    'joinStream': 'Join Stream',
    'share': 'Share',
    'following': 'Following'
  },
  'chat': {
    'messages': 'Messages',
    'aiAssistant': 'AI Assistant',
    'camera': 'Camera',
    'groupNamePrompt': 'Enter group name:',
    'typing': 'typing...',
    'online': 'Online',
    'offline': 'Offline'
  },
  'notifications': {
    'title': 'Notifications',
    'new': 'NEW',
    'all': 'All',
    'mentions': 'Mentions',
    'follows': 'Follows',
    'monetization': 'Monetization',
    'system': 'System',
    'noNotifs': 'No notifications yet',
    'noNotifsSubtitle': "When people interact with your content or there are system updates, they'll show up here.",
    'dailySummary': 'AI Daily Summary',
    'summaryDesc': 'You had {{likes}} likes and {{follows}} new followers today.'
  },
  'marketplace': {
    'title': 'Marketplace',
    'searchPlaceholder': 'Search for unique products...',
    'exclusiveDeals': 'Exclusive Deals',
    'dealsSubtitle': 'Discover unique products from top creators and business owners globally.',
    'shopNow': 'Shop Now',
    'categories': 'Categories',
    'featuredProducts': 'Featured Products',
    'seeAll': 'See All',
    'creatorPicks': 'Creator Picks',
    'creatorCornerTitle': 'Shop what your favorite Creators are promoting',
    'creatorCornerSubtitle': 'Real reviews, real people. Tagged products in videos and lives now available in one place.',
    'exploreFeed': 'Explore Feed'
  },
  'menu': {
    'title': 'Menu',
    'viewProfile': 'View Profile',
    'editProfile': 'Edit Profile',
    'business': 'Business Tool',
    'businessSubtitle': 'Manage your business & ads',
    'vipBadge': 'VIP Badge',
    'creatorCert': 'Creator Certification',
    'activeSub': 'Active Subscription',
    'getPremium': 'Get Premium Status',
    'certifiedCreator': 'Certified Creator',
    'applyBadge': 'Apply for Badge',
    'marketplace': 'Marketplace',
    'shopSell': 'Shop & Sell Globally',
    'wallet': 'Wallet',
    'payments': 'Payments & Earnings',
    'creator': 'Creator Tool',
    'settings': 'Settings',
    'monetization': 'Monetization',
    'payment': 'Payment',
    'darkMode': 'Dark Mode',
    'terms': 'Terms and Conditions',
    'privacy': 'Privacy Policy',
    'help': 'Help Center',
    'languages': 'Languages',
    'copyright': '© 2026 SS Corporate Inc'
  },
  'selector': {
    'title': 'Select Language',
    'searchPlaceholder': 'Search languages...',
    'popular': 'Popular Languages',
    'all': 'All Languages',
    'results': '{{count}} languages found',
    'noResults': 'No languages found for "{{query}}"',
    'footer': 'Femo Space supports 100+ languages to connect the world.'
  },
  'search': {
    'tabs': {
      'top': 'Top',
      'users': 'Users',
      'videos': 'Videos',
      'reels': 'Reels',
      'posts': 'Posts',
      'pages': 'Pages'
    },
    'placeholder': 'Search Femo Space...',
    'trendingNow': 'Trending Now',
    'recent': 'Recent',
    'clearAll': 'Clear all',
    'sections': {
      'people': 'People',
      'videos': 'Long-form Videos',
      'reels': 'Reels',
      'pages': 'Pages & Channels'
    },
    'officialSub': 'Official {{type}} for the Femo community.',
    'noResults': 'No results for "{{query}}"',
    'noResultsSubtitle': 'Try checking your spelling or using more general keywords.'
  },
  'wallet': {
    'title': 'Femo Wallet',
    'subtitle': 'Manage your global payments and creator earnings.',
    'loading': 'Loading Wallet...',
    'deposit': 'Deposit',
    'withdraw': 'Withdraw',
    'availableBalance': 'Available Balance',
    'withdrawable': 'Withdrawable',
    'trend': '+2.4% this month',
    'pendingBalance': 'Pending Balance',
    'escrowFunds': 'Escrow Funds',
    'txHistory': 'Transaction History',
    'transaction': 'Transaction',
    'aiCredits': 'AI Credits',
    'usedToday': 'Used today',
    'aiCreditsDesc': 'AI tools consume credits directly from your Femo Wallet.',
    'viewUsageLogs': 'View Usage Logs',
    'savedMethods': 'Saved Methods',
    'addMethod': 'Add Method',
    'shieldTitle': 'Enterprise Shield',
    'shieldDesc': 'All transactions are 256-bit encrypted and monitored for fraud.',
    'addFunds': 'Add Funds',
    'error': {
      'loadFailed': 'Failed to load wallet data. Please check your connection.'
    }
  },
  'ads': {
    'title': 'Ad Manager',
    'subtitle': 'Reach millions across the FemoSpace ecosystem',
    'createCampaign': 'CREATE CAMPAIGN',
    'activeCampaigns': 'Active Campaigns',
    'stats': {
      'impressions': 'Impressions',
      'clicks': 'Total Clicks',
      'ctr': 'Avg. CTR',
      'sales': 'Total Sales'
    },
    'table': {
      'overview': 'Campaign Overview',
      'budget': 'Budget / Spends'
    },
    'audienceReach': 'Audience Reach',
    'targetEfficiency': 'Target Efficiency',
    'reachEstimate': 'Your current targeting parameters reach approximately 2.4M monthly active users.',
    'targetCompetitors': 'Target Competitors',
    'retargetingPixels': 'Retargeting Pixels',
    'adWallet': 'Ad Wallet'
  },
  'creator': {
    'studio': 'Creator Studio',
    'tabs': {
      'overview': 'Overview',
      'content': 'Content',
      'analytics': 'Analytics',
      'monetization': 'Monetization',
      'audience': 'Audience'
    },
    'stats': {
      'totalViews': 'Total Views',
      'watchTime': 'Watch Time (hrs)',
      'followers': 'Followers',
      'estRevenue': 'Est. Revenue',
      'vsLast28': 'vs last 28 days'
    },
    'perfOverTime': 'Performance Over Time',
    'latestComments': 'Latest Comments',
    'mockComment': 'Great video! Really helped me understand the topic better. Keep it up!',
    'recentContent': 'Recent Content',
    'gotoContentMgr': 'Go to Content Manager',
    'level2': 'Level 2 Verified'
  },
  'monetization': {
    'hubTitle': 'Monetization Hub',
    'hubDesc': 'Manage your ad revenue, sponsorships, and payouts. You are estimated to earn {{earnings}} today.',
    'adsSettings': 'Ads Settings',
    'payoutMethods': 'Payout Methods',
    'sponsorships': 'Sponsorships',
    'taxInfo': 'Tax Info'
  },
  'footer': {
    'terms': 'Terms',
    'privacy': 'Privacy Policy',
    'contact': 'Contact Us',
    'copyright': '© 2026 SS Corporate Inc'
  }
};

const safeStringify = (obj) => {
    return JSON.stringify(obj, null, 2)
        .replace(/"([^"]+)":/g, "'$1':")
        .replace(/"/g, "'")
        .replace(/\\'/g, "'")
        .replace(/'/g, (match, offset, string) => {
             // Re-escape if it's internal
             if (offset > 0 && offset < string.length - 1) {
                 const prev = string[offset-1];
                 const next = string[offset+1];
                 if (prev !== ':' && prev !== '[' && prev !== '{' && prev !== ',' && prev !== ' ' &&
                     next !== ':' && next !== ',' && next !== '}' && next !== ']' && next !== '\n') {
                     return "\\'";
                 }
             }
             return "'";
        });
};

function findClosingBrace(str, startIndex) {
    let count = 0;
    for (let i = startIndex; i < str.length; i++) {
        if (str[i] === '{') count++;
        if (str[i] === '}') {
            count--;
            if (count === 0) return i;
        }
    }
    return -1;
}

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], mergeDeep(target[key], source[key] || {}));
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// 1. Replace 'en' block
const startEn = content.indexOf('const en = {');
const endEn = findClosingBrace(content, startEn + 11);
if (startEn !== -1 && endEn !== -1) {
    content = content.substring(0, startEn) + `const en = ${safeStringify(masterEn)};` + content.substring(endEn + 1);
}

// 2. Process all languages in 'resources'
const startResourcesLabel = 'const resources = {';
const startResources = content.indexOf(startResourcesLabel);
const endResources = findClosingBrace(content, startResources + startResourcesLabel.length - 1);
let resourcesText = content.substring(startResources, endResources + 1);

const langHeadRegex = /'([a-zA-Z-]+)':\s*{\s*translation:\s*/g;
let match;
const langBlocks = [];

while ((match = langHeadRegex.exec(resourcesText)) !== null) {
    const langCode = match[1];
    const startIndex = match.index + match[0].length;
    const endIndex = findClosingBrace(resourcesText, startIndex - 1);
    
    if (endIndex !== -1) {
        langBlocks.push({
            code: langCode,
            fullMatch: resourcesText.substring(match.index, endIndex + 1) + (resourcesText[endIndex + 1] === ',' ? ',' : ''),
            dataStart: startIndex - 1,
            dataEnd: endIndex + 1
        });
    }
}

let updatedResourcesText = resourcesText;
for (const block of langBlocks) {
    if (block.code === 'en') continue;

    try {
        const objText = resourcesText.substring(block.dataStart, block.dataEnd).replace(/,,/g, ',');
        const langData = eval(`(${objText})`);
        const merged = mergeDeep(JSON.parse(JSON.stringify(masterEn)), langData);
        
        const newBlockText = `'${block.code}': {
    translation: ${safeStringify(merged)}
  },`;
        
        updatedResourcesText = updatedResourcesText.replace(block.fullMatch, newBlockText);
    } catch (e) {
        console.error(`Failed to process ${block.code}:`, e.message);
    }
}

content = content.replace(resourcesText, updatedResourcesText);
// Final cleanup
content = content.replace(/,,/g, ',');
content = content.replace(/}\s*},\s*},\s*}/g, '}\n    }\n  }');
content = content.replace(/}\s*},\s*},\s*'/g, '}\n    }\n  },\n  \'');

fs.writeFileSync(i18nPath, content);
console.log('Successfully added copyright and rebuilt all languages.');
