function createColorPaletterVars() {
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];
  const colorPatteNumbers: App.Theme.ColorPaletteNumber[] = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
  ];

  const colorPatteVar = {} as App.Theme.ThemePaletteColor;
  colors.forEach((color) => {
    colorPatteVar[color] = `rgb(var(--${color}-color))`;
    colorPatteNumbers.forEach((number) => {
      colorPatteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`;
    });
  });

  return colorPatteVar;
}

const colorPaletteVars = createColorPaletterVars();

export const themeVars: App.Theme.ThemeTokenCSSVars = {
  colors: {
    ...colorPaletteVars,
    nprogress: 'rgb(var(--nprogress-color)))',
    container: 'rgb(var(--container-bg-color))',
    layout: 'rgb(var(--layout-bg-color))',
    inverted: 'rgb(var(--inverted-bg-color))',
    'base-text': 'rgb(var(--base-text-color))',
  },
  boxShadow: {
    header: 'var(--header-box-shadow)',
    sider: 'var(--sider-box-shadow)',
    tab: 'var(--table-box-shadow)',
  },
};
