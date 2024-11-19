import { h } from 'vue';
import type { Component } from 'vue';

export default function useSvgIconRender(SvgIcon: Component) {
  interface IconConfig {
    icon?: string;
    localIcon?: string;
    color?: string;
    fontSize?: number;
  }

  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>;

  const SvgIconVNode = (config: IconConfig) => {
    const { color, localIcon, icon, fontSize } = config;
    const style: IconStyle = {};
    if (color) {
      style.color = color;
    }

    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }
    if (!icon && !localIcon) {
      return undefined;
    }

    return () => h(SvgIcon, { icon, localIcon, style });
  };

  return {
    SvgIconVNode,
  };
}
