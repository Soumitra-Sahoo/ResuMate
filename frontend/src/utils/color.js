// src/utils/colors.js
export const fixTailwindColors = (element) => {
  const clone = element.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.width = `${element.offsetWidth}px`;
  document.body.appendChild(clone);

  // Convert oklch colors to rgb
  const convertOklch = (value) => {
    const oklchRegex = /oklch\(([^)]+)\)/g;
    return value.replace(oklchRegex, (match, params) => {
      try {
        // Parse oklch values: oklch(L C H / A) or oklch(L C H)
        const parts = params.split('/').map(p => p.trim());
        const values = parts[0].split(/\s+/).map(v => parseFloat(v));
        const alpha = parts[1] ? parseFloat(parts[1]) : 1;

        if (values.length >= 3) {
          const [l, c, h] = values;
          // Simple approximation for oklch to rgb
          // This is a basic conversion - for production, use a proper color library
          const chroma = c * 0.4; // Approximate scaling
          const hue = h * (Math.PI / 180); // Convert to radians

          const x = chroma * Math.cos(hue);
          const y = chroma * Math.sin(hue);

          const r = Math.max(0, Math.min(255, Math.round((l + 0.3963377774 * x + 0.2158037573 * y) * 255)));
          const g = Math.max(0, Math.min(255, Math.round((l - 0.1055613458 * x - 0.0638541728 * y) * 255)));
          const b = Math.max(0, Math.min(255, Math.round((l - 0.0894841775 * x - 1.2914855480 * y) * 255)));

          if (alpha < 1) {
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }
          return `rgb(${r}, ${g}, ${b})`;
        }
      } catch (e) {
        console.warn('Failed to convert oklch color:', match);
      }
      // Fallback: return a default color
      return 'rgb(0, 0, 0)';
    });
  };

  // Process all elements
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    const computed = window.getComputedStyle(el);

    // Handle background colors
    if (computed.backgroundColor.includes('oklch')) {
      el.style.backgroundColor = convertOklch(computed.backgroundColor);
    }

    // Handle text colors
    if (computed.color.includes('oklch')) {
      el.style.color = convertOklch(computed.color);
    }

    // Handle border colors
    if (computed.borderColor.includes('oklch')) {
      el.style.borderColor = convertOklch(computed.borderColor);
    }
  });

  return clone;
};

//Its a helper function to generate a random color