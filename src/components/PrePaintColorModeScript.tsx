import { DEFAULT_COLOR_MODES } from '@redocly/theme/core/constants';

import { COLOR_MODE_STORAGE_KEY } from '../jotai/app.js';
import { COLOR_MODE_ATTRIBUTES, REDOC_ROOT_CLASS } from '../jotai/color-mode.js';

const { LIGHT, DARK } = DEFAULT_COLOR_MODES;

export const prePaintColorModeScript =
  `try{var r=document.querySelectorAll(".${REDOC_ROOT_CLASS}");r=r[r.length-1];` +
  `var h=document.documentElement,p=h.classList,` +
  `a=[${COLOR_MODE_ATTRIBUTES.map((name) => `h.getAttribute("${name}")`).join(',')}];` +
  `var m=p.contains("${DARK}")||a.indexOf("${DARK}")>-1?"${DARK}":` +
  `p.contains("${LIGHT}")||a.indexOf("${LIGHT}")>-1?"${LIGHT}":localStorage.getItem("${COLOR_MODE_STORAGE_KEY}");` +
  `if(m!=="${LIGHT}"&&m!=="${DARK}")` +
  `m=matchMedia("(prefers-color-scheme: dark)").matches?"${DARK}":"${LIGHT}";` +
  `r.classList.remove("${LIGHT}","${DARK}");r.classList.add(m)}catch(e){}`;

export function PrePaintColorModeScript() {
  return (
    <div
      hidden
      dangerouslySetInnerHTML={{ __html: `<script>${prePaintColorModeScript}</script>` }}
    />
  );
}
