import { Injectable } from '@nestjs/common';

/**
 * I18N SERVICE
 * Handles translation and localization for backend responses
 * Returns localized error messages, validation messages, etc.
 */

interface TranslationMap {
    [key: string]: {
        [lang: string]: string;
    };
}

@Injectable()
export class I18nService {
    // Translation database for common messages
    private translations: TranslationMap = {
        // Authentication messages
        'auth.login.success': {
            en: 'Login successful',
            es: 'Inicio de sesión exitoso',
            fr: 'Connexion réussie',
            de: 'Anmeldung erfolgreich',
            'zh-CN': '登录成功',
            ja: 'ログイン成功',
            ar: 'تم تسجيل الدخول بنجاح',
            hi: 'लॉगिन सफल',
            pt: 'Login bem-sucedido',
            ru: 'Вход выполнен успешно',
            ko: '로그인 성공',
        },
        'auth.login.failed': {
            en: 'Invalid email or password',
            es: 'Correo electrónico o contraseña inválidos',
            fr: 'E-mail ou mot de passe invalide',
            de: 'Ungültige E-Mail oder Passwort',
            'zh-CN': '电子邮件或密码无效',
            ja: 'メールアドレスまたはパスワードが無効です',
            ar: 'البريد الإلكتروني أو كلمة المرور غير صالحة',
            hi: 'अमान्य ईमेल या पासवर्ड',
            pt: 'E-mail ou senha inválidos',
            ru: 'Неверный email или пароль',
            ko: '잘못된 이메일 또는 비밀번호',
        },
        'auth.register.success': {
            en: 'Registration successful',
            es: 'Registro exitoso',
            fr: 'Inscription réussie',
            de: 'Registrierung erfolgreich',
            'zh-CN': '注册成功',
            ja: '登録成功',
            ar: 'تم التسجيل بنجاح',
            hi: 'पंजीकरण सफल',
            pt: 'Registro bem-sucedido',
            ru: 'Регистрация успешна',
            ko: '등록 성공',
        },
        'auth.email.exists': {
            en: 'Email already exists',
            es: 'El correo electrónico ya existe',
            fr: 'L\'e-mail existe déjà',
            de: 'E-Mail existiert bereits',
            'zh-CN': '电子邮件已存在',
            ja: 'メールアドレスは既に存在します',
            ar: 'البريد الإلكتروني موجود بالفعل',
            hi: 'ईमेल पहले से मौजूद है',
            pt: 'E-mail já existe',
            ru: 'Email уже существует',
            ko: '이메일이 이미 존재합니다',
        },
        'auth.password.weak': {
            en: 'Password is too weak',
            es: 'La contraseña es demasiado débil',
            fr: 'Le mot de passe est trop faible',
            de: 'Passwort ist zu schwach',
            'zh-CN': '密码太弱',
            ja: 'パスワードが弱すぎます',
            ar: 'كلمة المرور ضعيفة جدًا',
            hi: 'पासवर्ड बहुत कमजोर है',
            pt: 'Senha muito fraca',
            ru: 'Пароль слишком слабый',
            ko: '비밀번호가 너무 약합니다',
        },
        'auth.unauthorized': {
            en: 'Unauthorized access',
            es: 'Acceso no autorizado',
            fr: 'Accès non autorisé',
            de: 'Unbefugter Zugriff',
            'zh-CN': '未经授权的访问',
            ja: '不正なアクセス',
            ar: 'وصول غير مصرح به',
            hi: 'अनधिकृत पहुंच',
            pt: 'Acesso não autorizado',
            ru: 'Несанкционированный доступ',
            ko: '무단 액세스',
        },

        // Validation messages
        'validation.required': {
            en: 'This field is required',
            es: 'Este campo es obligatorio',
            fr: 'Ce champ est obligatoire',
            de: 'Dieses Feld ist erforderlich',
            'zh-CN': '此字段为必填项',
            ja: 'このフィールドは必須です',
            ar: 'هذا الحقل مطلوب',
            hi: 'यह फ़ील्ड आवश्यक है',
            pt: 'Este campo é obrigatório',
            ru: 'Это поле обязательно',
            ko: '이 필드는 필수입니다',
        },
        'validation.email.invalid': {
            en: 'Invalid email format',
            es: 'Formato de correo electrónico no válido',
            fr: 'Format d\'e-mail invalide',
            de: 'Ungültiges E-Mail-Format',
            'zh-CN': '电子邮件格式无效',
            ja: '無効なメール形式',
            ar: 'تنسيق البريد الإلكتروني غير صالح',
            hi: 'अमान्य ईमेल प्रारूप',
            pt: 'Formato de e-mail inválido',
            ru: 'Неверный формат email',
            ko: '잘못된 이메일 형식',
        },

        // General messages
        'general.success': {
            en: 'Operation successful',
            es: 'Operación exitosa',
            fr: 'Opération réussie',
            de: 'Operation erfolgreich',
            'zh-CN': '操作成功',
            ja: '操作成功',
            ar: 'العملية ناجحة',
            hi: 'ऑपरेशन सफल',
            pt: 'Operação bem-sucedida',
            ru: 'Операция успешна',
            ko: '작업 성공',
        },
        'general.error': {
            en: 'An error occurred',
            es: 'Ocurrió un error',
            fr: 'Une erreur s\'est produite',
            de: 'Ein Fehler ist aufgetreten',
            'zh-CN': '发生错误',
            ja: 'エラーが発生しました',
            ar: 'حدث خطأ',
            hi: 'एक त्रुटि हुई',
            pt: 'Ocorreu um erro',
            ru: 'Произошла ошибка',
            ko: '오류가 발생했습니다',
        },
        'general.notFound': {
            en: 'Resource not found',
            es: 'Recurso no encontrado',
            fr: 'Ressource non trouvée',
            de: 'Ressource nicht gefunden',
            'zh-CN': '资源未找到',
            ja: 'リソースが見つかりません',
            ar: 'المورد غير موجود',
            hi: 'संसाधन नहीं मिला',
            pt: 'Recurso não encontrado',
            ru: 'Ресурс не найден',
            ko: '리소스를 찾을 수 없습니다',
        },
        // Profile messages
        'profile.notFound': {
            en: 'Profile not found',
            es: 'Perfil no encontrado',
            fr: 'Profil non trouvé',
            'zh-CN': '未找到个人资料',
            hi: 'प्रोफ़ाइल नहीं मिली',
        },
        'profile.update.success': {
            en: 'Profile updated successfully',
            es: 'Perfil actualizado con éxito',
            fr: 'Profil mis à jour avec succès',
            'zh-CN': '个人资料更新成功',
            hi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई',
        },
        'profile.follow.success': {
            en: 'You are now following this user',
            es: 'Ahora sigues a este usuario',
            fr: 'Vous suivez maintenant cet utilisateur',
            'zh-CN': '您现在已关注此用户',
            hi: 'अब आप इस उपयोगकर्ता को फ़ॉलो कर रहे हैं',
        },
    };

    /**
     * Get translated message
     * @param key - Translation key (e.g., 'auth.login.success')
     * @param lang - Language code (e.g., 'en', 'es')
     * @param fallback - Fallback message if translation not found
     */
    translate(key: string, lang: string = 'en', fallback?: string): string {
        const translation = this.translations[key];

        if (!translation) {
            return fallback || key;
        }

        // Try to get translation for requested language
        if (translation[lang]) {
            return translation[lang];
        }

        // Fallback to English
        if (translation['en']) {
            return translation['en'];
        }

        // Last resort: return key or fallback
        return fallback || key;
    }

    /**
     * Get translated message with variable interpolation
     * @param key - Translation key
     * @param lang - Language code
     * @param variables - Variables to interpolate (e.g., { name: 'John' })
     */
    translateWithVars(
        key: string,
        lang: string = 'en',
        variables: Record<string, string> = {},
    ): string {
        let message = this.translate(key, lang);

        // Replace variables in format {{variableName}}
        Object.keys(variables).forEach((varName) => {
            const regex = new RegExp(`{{${varName}}}`, 'g');
            message = message.replace(regex, variables[varName]);
        });

        return message;
    }

    /**
     * Add new translation
     * @param key - Translation key
     * @param translations - Object with language codes as keys
     */
    addTranslation(key: string, translations: { [lang: string]: string }) {
        this.translations[key] = translations;
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages(): string[] {
        // Get unique language codes from all translations
        const languages = new Set<string>();
        Object.values(this.translations).forEach((translation) => {
            Object.keys(translation).forEach((lang) => languages.add(lang));
        });
        return Array.from(languages);
    }
}
