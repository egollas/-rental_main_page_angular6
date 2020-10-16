export function setPhotoUrlResize(photoUrl: string, resize: number = 295): string {
    if (photoUrl.slice(photoUrl.length - 3) === '=s0') {
        return photoUrl.slice(0, photoUrl.length - 3) + '=s' + resize;
    } else {
        return photoUrl + '=s' + + resize;
    }
}

export function removeHtmlTags(text: string) {
    return text.replace(/<[^>]+>|&nbsp;/ig, ' ');
}

export function translateFinality(finality: string) {
    switch (finality) {
        case 'residential':
            return 'Residencial';
        case 'commercial':
            return 'Comercial';
        case 'rural':
            return 'Rural';
        default:
            return finality;
    }
}
