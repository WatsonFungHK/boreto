declare global {
  // Base mui styles (palette etc.)
  import { colors } from '@/themes/index';

  type ColorsType = typeof colors;
  type ColorsKeys = keyof ColorsType;
  type ExtractColorKey<T, K> = K extends `${T}${string}` ? K : never;
  type ColorValueKeys<T extends string> = ExtractColorKey<T, ColorsKeys>;
  type CustomColorPalette<T, C> = C extends Record<
    string,
    ColorsType[ColorsKeys]
  >
    ? {
        [K in ColorValueKeys<T> as RemoveColorKey<K, T>]: ColorsType[K];
      } & C
    : {
        [K in ColorValueKeys<T> as RemoveColorKey<K, T>]: ColorsType[K];
      };
  type RemoveColorKey<T, K> = T extends `${K}${infer U}` ? U : T;
  type CustomColorPaletteOptional<T, C> = C extends Record<
    string,
    ColorsType[ColorsKeys]
  >
    ? {
        [K in ColorValueKeys<T> as RemoveColorKey<K, T>]: ColorsType[K];
      } & C
    : {
        [K in ColorValueKeys<T> as RemoveColorKey<K, T>]?: ColorsType[K];
      };

  module '@mui/material/styles' {
    interface Palette {
      purple: CustomColorPalette<
        'purple',
        { contrastText: ColorsType['purple90'] }
      >;
      red: CustomColorPalette<'red', { contrastText: ColorsType['red70'] }>;
      brown: CustomColorPalette<
        'brown',
        { contrastText: ColorsType['brown90'] }
      >;
      mustard: CustomColorPalette<
        'mustard',
        { contrastText: ColorsType['mustard90'] }
      >;
      forest: CustomColorPalette<
        'forest',
        { contrastText: ColorsType['forest70'] }
      >;
      blue: CustomColorPalette<'blue', { contrastText: ColorsType['blue70'] }>;
      darkBlue: CustomColorPalette<
        'darkBlue',
        {
          contrastText: ColorsType['darkBlue90'];
          light: ColorsType['darkBlue90'];
        }
      >;
      gray: CustomColorPalette<'grey', { contrastText: ColorsType['grey90'] }>;
      indigo: CustomColorPalette<'indigo'>;
      turquoise: CustomColorPalette<'turquoise'>;
      orange: CustomColorPalette<'orange'>;
      emerald: CustomColorPalette<'emerald'>;
    }

    interface PaletteOptions {
      purple: CustomColorPaletteOptional<
        'purple',
        { contrastText?: ColorsType['purple90'] }
      >;
      red: CustomColorPaletteOptional<
        'red',
        { contrastText?: ColorsType['red70'] }
      >;
      brown: CustomColorPaletteOptional<
        'brown',
        { contrastText?: ColorsType['brown90'] }
      >;
      mustard: CustomColorPaletteOptional<
        'mustard',
        { contrastText?: ColorsType['mustard90'] }
      >;
      forest: CustomColorPaletteOptional<
        'forest',
        { contrastText?: ColorsType['forest70'] }
      >;
      blue: CustomColorPaletteOptional<
        'blue',
        { contrastText?: ColorsType['blue70'] }
      >;
      darkBlue: CustomColorPaletteOptional<
        'darkBlue',
        {
          contrastText?: ColorsType['darkBlue90'];
          light?: ColorsType['darkBlue90'];
        }
      >;
      gray: CustomColorPaletteOptional<
        'grey',
        { contrastText?: ColorsType['grey90'] }
      >;
      indigo: CustomColorPaletteOptional<'indigo'>;
      turquoise: CustomColorPaletteOptional<'turquoise'>;
      orange: CustomColorPaletteOptional<'orange'>;
      emerald: CustomColorPaletteOptional<'emerald'>;
    }
  }

  // Button
  module '@mui/material/Button' {
    interface ButtonPropsSizeOverrides {
      size: 'lg' | 'sm';
      sm: true;
      lg: true;
      small: false;
      medial: false;
      primary: false;
    }
  }

  module '@mui/material/IconButton' {
    interface IconButtonPropsSizeOverrides {
      size: 'md' | 'sm' | 'xs';
      xs: true;
      sm: true;
      md: true;
      medium: false;
    }
  }

  // Tooltip
  module '@mui/material/Tooltip' {
    interface TooltipProps {
      size?: 'sm' | 'md';
    }
  }

  // Base style
  module '@mui/material/styles' {
    interface TypographyVariants {
      display1: React.CSSProperties;
      headline1: React.CSSProperties;
      headline2: React.CSSProperties;
      headline3: React.CSSProperties;
      headline4: React.CSSProperties;
      headline5: React.CSSProperties;
      body1: React.CSSProperties;
      body2: React.CSSProperties;
      body3: React.CSSProperties;
      subtitle: React.CSSProperties;
      link1: React.CSSProperties;
      link2: React.CSSProperties;
      link3: React.CSSProperties;
      tag: React.CSSProperties;
      button1: React.CSSProperties;
      button3: React.CSSProperties;
      button2: React.CSSProperties;
      menu1: React.CSSProperties;
      menu2: React.CSSProperties;
      ellipsis: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
      display1?: React.CSSProperties;
      headline1?: React.CSSProperties;
      headline2?: React.CSSProperties;
      headline3?: React.CSSProperties;
      headline4?: React.CSSProperties;
      headline5?: React.CSSProperties;
      body1?: React.CSSProperties;
      body2?: React.CSSProperties;
      body3?: React.CSSProperties;
      subtitle?: React.CSSProperties;
      link1?: React.CSSProperties;
      link2?: React.CSSProperties;
      link3?: React.CSSProperties;
      tag?: React.CSSProperties;
      button1?: React.CSSProperties;
      button2?: React.CSSProperties;
      button3?: React.CSSProperties;
      menu1?: React.CSSProperties;
      menu2?: React.CSSProperties;
      ellipsis?: React.CSSProperties;
    }
  }

  // Table column sizes
  module '@mui/material/styles' {
    declare interface Theme {
      table: {
        columnSizes: {
          xxs: number;
          xs: number;
          sm: number;
          md: number;
          lg: number;
          xl: number;
        };
      };
    }

    interface ThemeOptions {
      table?: {
        columnSizes?: {
          xxs?: number;
          xs?: number;
          sm?: number;
          md?: number;
          lg?: number;
          xl?: number;
        };
      };
    }
  }

  // Typography
  module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
      display1: true;
      headline1: true;
      headline2: true;
      headline3: true;
      headline4: true;
      headline5: true;
      body1: true;
      body2: true;
      body3: true;
      subtitle: true;
      link1: true;
      link2: true;
      link3: true;
      tag: true;
      button1: true;
      button3: true;
      button2: true;
      menu1: true;
      menu2: true;
    }
  }

  // breakpoints
  module '@mui/material/styles' {
    interface BreakpointOverrides {
      xs: true;
      sm: false;
      md: true;
      lg: true;
      xl: false;
    }
  }
  // Tag
  module '@mui/material/Chip' {
    interface ChipColors {
      purple?: string;
      red?: string;
      brown?: string;
      mustard?: string;
      forest?: string;
      blue?: string;
      gray?: string;
      indigo?: string;
      error?: string;
      warning?: string;
      success?: string;
    }

    interface ChipPropsColorOverrides {
      purple: true;
      red: true;
      brown: true;
      mustard: true;
      forest: true;
      blue: true;
      gray: true;
      indigo: true;
      error: true;
      warning: true;
      success: true;
    }
  }

  module '@mui/material/Tabs' {
    interface TabsPropsIndicatorColorOverrides {
      orange: true;
    }
  }
}
