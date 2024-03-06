export const formatStarsCount = (count: number): string => {
    if (count >= 1e6) {
        return (count / 1e6).toFixed(1) + 'M';
    } else if (count >= 1e3) {
        return (count / 1e3).toFixed(1) + 'K';
    } else {
        return count.toString();
    }
}