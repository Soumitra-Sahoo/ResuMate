export const fixTailwindColors = (element) => {
    if (!element) return null

    const clone = element.cloneNode(true)
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.top = '0'
    clone.style.width = `${element.offsetWidth}px`
    document.body.appendChild(clone)

    const COLOR_PROPS = [
        'color', 'backgroundColor', 'borderColor',
        'borderTopColor', 'borderRightColor',
        'borderBottomColor', 'borderLeftColor',
        'outlineColor', 'fill', 'stroke',
    ]

    const allEls = [clone, ...clone.querySelectorAll('*')]
    allEls.forEach((el) => {
        const computed = window.getComputedStyle(el)
        COLOR_PROPS.forEach((prop) => {
            const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
            const val = computed.getPropertyValue(cssProp)
            if (val && val.includes('oklch')) {
                // Safe fallback — white for backgrounds, black for text/borders
                el.style[prop] = prop === 'backgroundColor'
                    ? '#ffffff'
                    : '#000000'
            }
        })

        // Also handle inline style attributes that may contain oklch
        if (el.style && el.style.cssText && el.style.cssText.includes('oklch')) {
            el.style.cssText = el.style.cssText.replace(
                /oklch\([^)]+\)/g,
                '#000000'
            )
        }

        // SVG attributes
        if (el instanceof SVGElement) {
            ;['fill', 'stroke'].forEach((attr) => {
                const val = el.getAttribute(attr)
                if (val && val.includes('oklch')) el.setAttribute(attr, '#000000')
            })
        }
    })

    return clone
}