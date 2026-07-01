import html2canvas from "html2canvas";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export function formatYearMonth(yearMonth) {
    return yearMonth ? dayjs(yearMonth, "YYYY-MM").format("MMM YYYY") : "";
}

export function inlineAllComputedStyles(root) {
    const SAFE_PROPS = [
        'color', 'backgroundColor', 'borderColor', 'borderTopColor',
        'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'outlineColor', 'textDecorationColor', 'fill', 'stroke',
        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
        'lineHeight', 'letterSpacing', 'textAlign', 'textTransform',
        'display', 'flexDirection', 'alignItems', 'justifyContent',
        'width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight',
        'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'border', 'borderWidth', 'borderStyle', 'borderRadius',
        'position', 'top', 'right', 'bottom', 'left',
        'overflow', 'overflowX', 'overflowY',
        'flexWrap', 'gap', 'flex', 'flexGrow', 'flexShrink',
        'gridTemplateColumns', 'gridColumn', 'gridTemplateRows',
        'boxSizing', 'whiteSpace', 'wordBreak', 'overflowWrap',
        'opacity', 'zIndex', 'transform', 'boxShadow',
    ]

    const nodes = [root, ...root.querySelectorAll('*')]
    nodes.forEach((node) => {
        if (node.nodeType !== 1) return
        const cs = window.getComputedStyle(node)
        SAFE_PROPS.forEach((prop) => {
            try {
                let val = cs.getPropertyValue(
                    prop.replace(/([A-Z])/g, '-$1').toLowerCase()
                )
                if (!val) return
                if (val.includes('oklch')) {
                    if (prop === 'backgroundColor') val = 'rgb(255,255,255)'
                    else val = 'rgb(0,0,0)'
                }
                node.style[prop] = val
            } catch {
                // skip
            }
        })
    })
}

export const fixTailwindColors = (rootElement) => {
    if (!rootElement) return
    const elements = [rootElement, ...rootElement.querySelectorAll('*')]
    elements.forEach((el) => {
        const style = window.getComputedStyle(el)
        ;['color', 'backgroundColor', 'borderColor',
          'borderTopColor', 'borderRightColor',
          'borderBottomColor', 'borderLeftColor'].forEach((prop) => {
            const val = style[prop] || ''
            if (val.includes('oklch')) {
                el.style[prop] = prop === 'backgroundColor'
                    ? 'rgb(255, 255, 255)'
                    : 'rgb(0, 0, 0)'
            }
        })
        if (el instanceof SVGElement) {
            const fill = el.getAttribute('fill')
            if (fill && fill.includes('oklch')) el.setAttribute('fill', '#000')
            const stroke = el.getAttribute('stroke')
            if (stroke && stroke.includes('oklch')) el.setAttribute('stroke', '#000')
        }
    })
}

export const getLightColorFromImage = (imageUrl) => {
    return new Promise((resolve) => {
        if (!imageUrl || typeof imageUrl !== 'string') return resolve('#ffffff')
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            let r = 0, g = 0, b = 0, count = 0
            for (let i = 0; i < data.length; i += 4) {
                const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
                if (brightness > 100) { r += data[i]; g += data[i + 1]; b += data[i + 2]; count++ }
            }
            if (count === 0) return resolve('#ffffff')
            resolve(`rgb(${Math.round(r/count)}, ${Math.round(g/count)}, ${Math.round(b/count)})`)
        }
        img.onerror = () => resolve('#ffffff')
        if (!imageUrl.startsWith('data:')) img.crossOrigin = 'anonymous'
        img.src = imageUrl
    })
}

export async function captureElementAsImage(element) {
    if (!element) throw new Error('No element provided')
    const clone = element.cloneNode(true)
    clone.style.position = 'absolute'
    clone.style.top = '-9999px'
    clone.style.left = '0'
    clone.style.opacity = '0'
    const { width, height } = element.getBoundingClientRect()
    clone.style.width = `${width}px`
    clone.style.height = `${height}px`
    document.body.appendChild(clone)
    inlineAllComputedStyles(clone)

    try {
        const canvas = await html2canvas(clone, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF',
        })
        return canvas.toDataURL('image/png')
    } finally {
        document.body.removeChild(clone)
    }
}

export const dataURLtoFile = (dataUrl, fileName) => {
    const [header, base64] = dataUrl.split(',')
    const mime = header.match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(base64)
    const u8arr = new Uint8Array(bstr.length)
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i)
    return new File([u8arr], fileName, { type: mime })
}