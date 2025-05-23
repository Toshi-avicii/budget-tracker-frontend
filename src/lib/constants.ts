export enum ChangePeriods {
    DAILY = "Last Day",
    WEEKLY = "Last Week",
    MONTHLY = "Last Month",
    YEARLY = "Last Year"
}

export const CURRENCIES = {
    USD: { name: "United States Dollar", symbol: "$" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound Sterling", symbol: "£" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    AUD: { name: "Australian Dollar", symbol: "A$" },
    CAD: { name: "Canadian Dollar", symbol: "C$" },
    CHF: { name: "Swiss Franc", symbol: "CHF" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    RUB: { name: "Russian Ruble", symbol: "₽" },
    BRL: { name: "Brazilian Real", symbol: "R$" },
    ZAR: { name: "South African Rand", symbol: "R" },
    SGD: { name: "Singapore Dollar", symbol: "S$" },
    HKD: { name: "Hong Kong Dollar", symbol: "HK$" },
    KRW: { name: "South Korean Won", symbol: "₩" },
    MXN: { name: "Mexican Peso", symbol: "MX$" },
    NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
    SEK: { name: "Swedish Krona", symbol: "kr" },
    NOK: { name: "Norwegian Krone", symbol: "kr" },
    DKK: { name: "Danish Krone", symbol: "kr" },
    THB: { name: "Thai Baht", symbol: "฿" },
    MYR: { name: "Malaysian Ringgit", symbol: "RM" },
    IDR: { name: "Indonesian Rupiah", symbol: "Rp" },
    PHP: { name: "Philippine Peso", symbol: "₱" },
    TRY: { name: "Turkish Lira", symbol: "₺" },
    PLN: { name: "Polish Zloty", symbol: "zł" },
    HUF: { name: "Hungarian Forint", symbol: "Ft" },
    CZK: { name: "Czech Koruna", symbol: "Kč" },
    AED: { name: "United Arab Emirates Dirham", symbol: "د.إ" },
    SAR: { name: "Saudi Riyal", symbol: "﷼" },
} as const;

export enum EXPENSE_TYPES {
    FOOD = 'food',
    TRANSPORT = "transport",
    HEALTHCARE = "healthcare",
    EDUCATION = "education",
    CLOTHES = "clothes",
    ENTERTAINMENT = "entertainment",
    MISCELLANOUS = "miscellanous"
}

export enum PERIOD_TYPES {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    HALFYEARLY = 'half yearly',
    YEARLY = 'yearly',
    NOLIMIT = 'no limit'
}

export const months = [
    "January",
    "February",
    "March",
    "April",
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];