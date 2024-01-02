export const calcMccHeight = (marpleBridgeHeight, compstallHeight) => {
    var goytFactor = 0.0;
    if (marpleBridgeHeight >= 0.2) {
        goytFactor = marpleBridgeHeight*8.8-0.9;
    } else if (marpleBridgeHeight >= 0.1) {
        goytFactor = 0.6;
    }
    var etherowFactor = 0.0;
    if (compstallHeight >= 0.2) {
        etherowFactor = compstallHeight*8.8-1.0;
    } else if (compstallHeight >= 0.1) {
        etherowFactor = 0.6;
    }
    return (goytFactor + etherowFactor);
}

export const calcTrend = (currentValue, prevValue) => {
    if (currentValue > prevValue) {
        return "↗";
    } else if (currentValue < prevValue) {
        return "↘";
    }
    return "→";
}

