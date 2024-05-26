/**
 * Map languages codes to country codes
 */
const languageToCountryMap = {
    'af': 'ZA', // South Africa
    'sq': 'AL', // Albania
    'am': 'ET', // Ethiopia
    'ar': 'SA', // Saudi Arabia (general Arabic)
    'hy': 'AM', // Armenia
    'az': 'AZ', // Azerbaijan
    'eu': 'ES', // Spain (Basque)
    'be': 'BY', // Belarus
    'bn': 'BD', // Bangladesh
    'bs': 'BA', // Bosnia and Herzegovina
    'bg': 'BG', // Bulgaria
    'ca': 'ES', // Spain (Catalonia)
    'ceb': 'PH', // Philippines (Cebuano)
    'ny': 'MW', // Malawi (Chichewa)
    'zh-cn': 'CN', // China (Simplified Chinese)
    'zh-tw': 'TW', // Taiwan (Traditional Chinese)
    'co': 'FR', // France (Corsican)
    'hr': 'HR', // Croatia
    'cs': 'CZ', // Czech Republic
    'da': 'DK', // Denmark
    'nl': 'NL', // Netherlands
    'en': 'US', // United States (general English)
    'eo': 'EU', // Europe (Esperanto)
    'et': 'EE', // Estonia
    'tl': 'PH', // Philippines (Filipino)
    'fi': 'FI', // Finland
    'fr': 'FR', // France
    'fy': 'NL', // Netherlands (Frisian)
    'gl': 'ES', // Spain (Galician)
    'ka': 'GE', // Georgia
    'de': 'DE', // Germany
    'el': 'GR', // Greece
    'gu': 'IN', // India (Gujarati)
    'ht': 'HT', // Haiti (Haitian Creole)
    'ha': 'NG', // Nigeria (Hausa)
    'haw': 'US', // United States (Hawaiian)
    'iw': 'IL', // Israel (Hebrew)
    'he': 'IL', // Israel (Hebrew)
    'hi': 'IN', // India (Hindi)
    'hmn': 'CN', // China (Hmong)
    'hu': 'HU', // Hungary
    'is': 'IS', // Iceland
    'ig': 'NG', // Nigeria (Igbo)
    'id': 'ID', // Indonesia
    'ga': 'IE', // Ireland (Irish)
    'it': 'IT', // Italy
    'ja': 'JP', // Japan
    'jw': 'ID', // Indonesia (Javanese)
    'kn': 'IN', // India (Kannada)
    'kk': 'KZ', // Kazakhstan
    'km': 'KH', // Cambodia
    'ko': 'KR', // South Korea
    'ku': 'IQ', // Iraq (Kurdish)
    'ky': 'KG', // Kyrgyzstan
    'lo': 'LA', // Laos
    'la': 'VA', // Vatican (Latin)
    'lv': 'LV', // Latvia
    'lt': 'LT', // Lithuania
    'lb': 'LU', // Luxembourg
    'mk': 'MK', // North Macedonia
    'mg': 'MG', // Madagascar
    'ms': 'MY', // Malaysia
    'ml': 'IN', // India (Malayalam)
    'mt': 'MT', // Malta
    'mi': 'NZ', // New Zealand (Maori)
    'mr': 'IN', // India (Marathi)
    'mn': 'MN', // Mongolia
    'my': 'MM', // Myanmar (Burmese)
    'ne': 'NP', // Nepal
    'no': 'NO', // Norway
    'or': 'IN', // India (Odia)
    'ps': 'AF', // Afghanistan (Pashto)
    'fa': 'IR', // Iran (Persian)
    'pl': 'PL', // Poland
    'pt': 'PT', // Portugal
    'pa': 'IN', // India (Punjabi)
    'ro': 'RO', // Romania
    'ru': 'RU', // Russia
    'sm': 'WS', // Samoa
    'gd': 'GB', // United Kingdom (Scots Gaelic)
    'sr': 'RS', // Serbia
    'st': 'ZA', // South Africa (Sesotho)
    'sn': 'ZW', // Zimbabwe (Shona)
    'sd': 'PK', // Pakistan (Sindhi)
    'si': 'LK', // Sri Lanka (Sinhala)
    'sk': 'SK', // Slovakia
    'sl': 'SI', // Slovenia
    'so': 'SO', // Somalia
    'es': 'ES', // Spain
    'su': 'ID', // Indonesia (Sundanese)
    'sw': 'TZ', // Tanzania (Swahili)
    'sv': 'SE', // Sweden
    'tg': 'TJ', // Tajikistan
    'ta': 'IN', // India (Tamil)
    'te': 'IN', // India (Telugu)
    'th': 'TH', // Thailand
    'tr': 'TR', // Turkey
    'uk': 'UA', // Ukraine
    'ur': 'PK', // Pakistan (Urdu)
    'ug': 'CN', // China (Uyghur)
    'uz': 'UZ', // Uzbekistan
    'vi': 'VN', // Vietnam
    'cy': 'GB', // United Kingdom (Welsh)
    'xh': 'ZA', // South Africa (Xhosa)
    'yi': 'IL', // Israel (Yiddish)
    'yo': 'NG', // Nigeria (Yoruba)
    'zu': 'ZA', // South Africa (Zulu)
};


/**
 * Change the flag icon
 * @param {HTMLSelectElement} select - The select element
 */
export function changeFlag(select) {
    const img = document.getElementById(`${select.id}-flag-icon`)
    if (select.value === "auto") {
        img.src = `/static/images/auto_language.png`
    }
    else {
        img.src = `https://flagsapi.com/${languageToCountryMap[select.value]}/shiny/32.png`
    }
}
