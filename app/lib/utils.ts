export function decodeHtml(html: string) {
    if (typeof document === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export function clamp(n: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, n));
}
