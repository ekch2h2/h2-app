export function isListLine(s) {
    return s.match(/^[0-9]+\. /) || s.match(/^\* /)
}

export function markdownTextPreProcess(s) {
    if (!s) {
        return s;
    }
    let bodyFinal = "";
    let prevLine = "";
    s.split("\n").forEach(rawLine => {
        const line = rawLine.trim();
        if (!isListLine(prevLine) && isListLine(line)) {
            bodyFinal += "\n"
        }
        bodyFinal += line;
        bodyFinal = bodyFinal.replace(/。/g, " 。");
        bodyFinal = bodyFinal.replace(/）/g, " ） ");
        bodyFinal = bodyFinal.replace(/（/g, " （ ");
        bodyFinal += "\n";
        prevLine = line;
    });

    return bodyFinal;
}