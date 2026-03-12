import { getCurrentLanguage } from '../helpers/lang';

export const formatDate = (dateString: string, lang?: string): string => {



    const locale = (lang || getCurrentLanguage()) === 'uk' ? 'uk-UA' : 'en-GB';
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: 'Europe/Kyiv',
    };

    const date = new Date(dateString + 'Z');
    const formattedDate = date.toLocaleString(locale, options);

    const dateParts = formattedDate.match(
        /(\w+) (\d+), (\d+), (\d+:\d+) ([APap][Mm])/,
    );
    if (dateParts) {
        const [, month, day, year, time, period] = dateParts;
        return `${day} ${month} ${year}, ${time} ${period}`;
    }

    return formattedDate;
};

export const formatDateShort = (dateString: string, lang?: string): string => {


    const locale = (lang || getCurrentLanguage()) === 'uk' ? 'uk-UA' : 'en-GB';

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleString(locale, options);

    const dateParts = formattedDate.match(/(\w+) (\d+), (\d+)/);
    if (dateParts) {
        const [, month, day, year] = dateParts;
        return `${day} ${month} ${year}`;
    }

    return formattedDate;
};