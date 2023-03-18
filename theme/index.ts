// import {
//   createTheme,
//   Shadows,
//   TypographyVariantsOptions,
// } from '@mui/material/styles';
// import colors from './colors';

// const theme = createTheme({
//   // Shadows definitions
//   // Reference: https://stackoverflow.com/questions/65792331/how-to-override-material-ui-shadows-in-the-theme
//   shadows: [
//     'none',
//     '0px 2px 12px 2px hsla(216, 100%, 50%, 0.1)',
//     '0px 8px 10px 3px hsla(0, 0%, 93%, 1)',
//     '0px 8px 16px 2px hsla(216, 100%, 50%, 0.04)',
//     '0px 8px 32px 2px hsla(216, 100%, 50%, 0.1)',
//     //secondary menu shadow
//     '0px 6px 16px 4px hsla(216, 100%, 50%, 0.1)',
//     ...new Array(20).fill('none'),
//   ] as Shadows,

//   // Colors palette definitions
//   colors: colors,
//   palette: {
//     divider: colors.grey30,
//     primary: {
//       main: colors.darkBlue90,
//     },
//     blue: {
//       contrastText: colors.blue70,
//       5: colors.blue5,
//       10: colors.blue10,
//       20: colors.blue20,
//       30: colors.blue30,
//       70: colors.blue70,
//       80: colors.blue80,
//       90: colors.blue90,
//     },
//     darkBlue: {
//       light: colors.blue90,
//       contrastText: colors.blue90,
//       40: colors.darkBlue40,
//       50: colors.darkBlue50,
//       60: colors.darkBlue60,
//       70: colors.darkBlue70,
//       80: colors.darkBlue80,
//       90: colors.darkBlue90,
//     },
//     // Use gray instead of grey because grey is typed by mui internally
//     gray: {
//       contrastText: colors.grey90,
//       5: colors.grey5,
//       10: colors.grey10,
//       20: colors.grey20,
//       30: colors.grey30,
//       70: colors.grey70,
//       80: colors.grey80,
//       90: colors.grey90,
//     },
//     turquoise: {
//       5: colors.turquoise5,
//       90: colors.turquoise90,
//     },
//     purple: {
//       contrastText: colors.purple90,
//       10: colors.purple10,
//       80: colors.purple80,
//       90: colors.purple90,
//     },
//     orange: {
//       5: colors.orange5,
//       10: colors.orange10,
//       20: colors.orange20,
//       30: colors.orange30,
//       80: colors.orange80,
//       90: colors.orange90,
//     },
//     mustard: {
//       contrastText: colors.mustard90,
//       5: colors.mustard5,
//       50: colors.mustard50,
//       90: colors.mustard90,
//     },
//     red: {
//       contrastText: colors.red70,
//       5: colors.red5,
//       10: colors.red10,
//       20: colors.red20,
//       30: colors.red30,
//       60: colors.red60,
//       70: colors.red70,
//       80: colors.red80,
//       90: colors.red90,
//     },
//     forest: {
//       contrastText: colors.forest70,
//       5: colors.forest5,
//       10: colors.forest10,
//       20: colors.forest20,
//       30: colors.forest30,
//       60: colors.forest60,
//       70: colors.forest70,
//       80: colors.forest80,
//       90: colors.forest90,
//     },
//     emerald: {
//       90: colors.emerald90,
//     },
//     brown: {
//       contrastText: colors.brown90,
//       10: colors.brown10,
//       90: colors.brown90,
//     },
//     indigo: {
//       contrastText: colors.darkBlue50,
//     },
//   },
//   // Typography
//   typography,
//   components: {
//     // Global base styles
//     MuiCssBaseline: {
//       styleOverrides: `
//         @font-face {
//           font-family: 'Matter';
//           font-style: normal;
//           font-weight: 600;
//           font-display: swap;
//           src: local('Matter'), url('/fonts/Matter-SemiBold.woff2') format('woff2');
//           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
//         }
//         @font-face {
//           font-family: 'Inter';
//           font-style: normal;
//           font-weight: 100 900;
//           font-display: swap;
//           src: local('Inter'), url('/fonts/Inter-var.woff2') format('woff2');
//           unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
//         }
//       `,
//     },
//     MuiTypography: {
//       defaultProps: {
//         variantMapping: {
//           headline1: 'h1',
//           headline2: 'h2',
//           headline3: 'h3',
//           headline4: 'h4',
//           headline5: 'h5',
//         },
//       },
//     },
//     MuiDialog: {
//       styleOverrides: {
//         root: {
//           '& > .MuiBackdrop-root': {
//             backgroundColor: 'rgba(0,0,0,0.8)',
//           },
//         },
//       },
//     },
//     // Tag styles
//     MuiChip: {
//       // defaultProps: {
//       //   deleteIcon: <Icon icon="x-close" size={12} />,
//       // },
//       styleOverrides: {
//         root: {
//           ...typography.tag,
//           textTransform: 'uppercase',
//           height: 'unset',
//           padding: '6px 8px',
//           ':has(.MuiChip-deleteIcon)': {
//             padding: '6px 10px',
//           },
//           display: 'flex',
//           gap: '6px',
//         },
//         label: {
//           padding: 0,
//         },
//         icon: {
//           margin: 0,
//         },
//         deleteIcon: {
//           margin: '0 0px 0 6px',
//         },
//       },
//       variants: [
//         {
//           props: { color: 'success' },
//           style: {
//             color: colors.forest90,
//             backgroundColor: colors.forest10,
//             '& > .MuiChip-deleteIcon': {
//               color: colors.forest90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.forest90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'warning' },
//           style: {
//             color: colors.orange90,
//             backgroundColor: colors.orange20,
//             '& > .MuiChip-deleteIcon': {
//               color: colors.orange90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.orange90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'error' },
//           style: {
//             color: colors.red90,
//             backgroundColor: colors.red5,
//             '.MuiChip-deleteIcon': {
//               color: colors.red90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.red90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'purple' },
//           style: {
//             backgroundColor: colors.purple10,
//             '.MuiChip-deleteIcon': {
//               color: colors.purple90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.purple90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'red' },
//           style: {
//             backgroundColor: colors.red10,
//             '.MuiChip-deleteIcon': {
//               color: colors.red70,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.red70,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'brown' },
//           style: {
//             backgroundColor: colors.brown10,
//             '.MuiChip-deleteIcon': {
//               color: colors.brown90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.brown90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'mustard' },
//           style: {
//             backgroundColor: colors.mustard5,
//             '.MuiChip-deleteIcon': {
//               color: colors.mustard90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.mustard90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'forest' },
//           style: {
//             backgroundColor: colors.forest20,
//             '.MuiChip-deleteIcon': {
//               color: colors.forest70,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.forest70,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'blue' },
//           style: {
//             color: colors.blue70,
//             backgroundColor: colors.turquoise5,
//             '.MuiChip-deleteIcon': {
//               color: colors.blue70,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.blue70,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'gray' },
//           style: {
//             backgroundColor: colors.grey30,
//             '.MuiChip-deleteIcon': {
//               color: colors.grey90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.grey90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'indigo' },
//           style: {
//             backgroundColor: colors.blue30,
//             '.MuiChip-deleteIcon': {
//               color: colors.darkBlue50,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.darkBlue50,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'info' },
//           style: {
//             fontWeight: 400,
//             backgroundColor: colors.grey10,
//             color: colors.grey90,
//             '.MuiChip-deleteIcon': {
//               color: colors.darkBlue90,
//               ':hover': {
//                 opacity: 0.6,
//                 color: colors.darkBlue50,
//               },
//             },
//           },
//         },
//       ],
//     },
//     // Form Label Style
//     MuiInputLabel: {
//       styleOverrides: {
//         root: {
//           ...typography.subtitle,
//           transform: 'none',
//           position: 'static',
//           marginBottom: '8px',
//           borderColor: colors.grey30,
//           '&.Mui-focused': {
//             color: colors.grey80,
//           },
//         },
//       },
//     },
//     // Input styles
//     MuiInputBase: {
//       styleOverrides: {
//         root: {
//           ...typography.body1,
//           height: '36px',
//           width: '100%',
//           borderColor: colors.grey30,
//           marginTop: '0 !important',
//           '.MuiInputBase-root': {
//             paddingLeft: '8px',
//             paddingRight: '8px',
//           },
//           '.MuiInputBase-inputAdornedStart': {
//             paddingLeft: '4px',
//           },
//           'fieldset.MuiOutlinedInput-notchedOutline': {
//             borderColor: 'inherit',
//           },
//           input: {
//             // disabled to show entire input value
//             // height: 0,
//           },
//           '&.Mui-disabled': {
//             'fieldset.MuiOutlinedInput-notchedOutline': {
//               borderColor: 'inherit',
//             },
//             '&:hover': {
//               borderColor: colors.grey20,
//             },
//             borderColor: colors.grey20,
//             backgroundColor: colors.grey20,
//           },
//           '&:hover': {
//             borderColor: colors.grey70,
//             'fieldset.MuiOutlinedInput-notchedOutline': {
//               borderColor: 'inherit',
//             },
//           },
//           '&.Mui-focused': {
//             borderColor: colors.blue90,
//             'fieldset.MuiOutlinedInput-notchedOutline': {
//               borderColor: 'inherit',
//               boxShadow: '0px 0px 10px 3px rgba(0, 102, 255, 0.12)',
//               borderWidth: '1px',
//             },
//           },
//         },
//         input: {
//           root: {
//             marginTop: 0,
//           }
          
//         },
//       },
//       variants: [
//         {
//           props: { multiline: true },
//           style: {
//             height: '100%',
//           },
//         },
//       ],
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& legend': { display: 'none' },
//           '& fieldset': { top: 0 },
//           width: '100%',
//           '& .MuiFormHelperText-root': {
//             margin: '4px 0 0 0',
//           },
//         },
//       },
//     },
//     // Button styles
//     MuiButtonBase: {
//       defaultProps: {
//         disableRipple: true,
//       },
//     },
//     MuiButton: {
//       defaultProps: {
//         size: 'sm',
//       },
//       styleOverrides: {
//         root: {
//           fontFamily: HEADER_FONT_FAMILY,
//           fontWeight: 600,
//           textTransform: 'none',
//           letterSpacing: 0,
//           lineHeight: 1,
//         },
//       },
//       variants: [
//         {
//           props: { size: 'lg' },
//           style: {
//             padding: '11px 20px',
//             fontSize: '1rem',
//           },
//         },
//         {
//           props: { size: 'sm' },
//           style: {
//             padding: '8px 20px',
//             fontSize: '0.875rem',
//           },
//         },
//         {
//           props: { variant: 'contained' },
//           style: {
//             boxShadow: 'none',
//             color: colors.white,
//             backgroundColor: colors.blue90,
//             ':hover': {
//               boxShadow: 'none',
//               backgroundColor: colors.blue80,
//             },
//             '&.Mui-disabled': {
//               color: colors.white,
//               backgroundColor: colors.blue30,
//             },
//           },
//         },
//         {
//           props: { variant: 'contained', color: 'error' },
//           style: {
//             boxShadow: 'none',
//             color: colors.white,
//             backgroundColor: colors.red90,
//             ':hover': {
//               boxShadow: 'none',
//               backgroundColor: colors.red80,
//             },
//             '&.Mui-disabled': {
//               color: colors.white,
//               backgroundColor: colors.red30,
//             },
//           },
//         },
//         {
//           props: { variant: 'contained', color: 'warning' },
//           style: {
//             boxShadow: 'none',
//             color: colors.white,
//             backgroundColor: colors.orange90,
//             ':hover': {
//               boxShadow: 'none',
//               backgroundColor: colors.orange80,
//             },
//             '&.Mui-disabled': {
//               color: colors.white,
//               backgroundColor: colors.orange30,
//             },
//           },
//         },
//         {
//           props: { variant: 'outlined' },
//           style: {
//             color: colors.blue90,
//             border: `1px solid ${colors.blue90}`,
//             ':hover': {
//               color: colors.blue80,
//               backgroundColor: colors.blue20,
//               border: `1px solid ${colors.blue80}`,
//             },
//             '&.Mui-disabled': {
//               color: colors.blue30,
//               borderColor: colors.blue30,
//             },
//           },
//         },
//         {
//           props: { variant: 'outlined', color: 'error' },
//           style: {
//             color: colors.red90,
//             border: `1px solid ${colors.red90}`,
//             ':hover': {
//               color: colors.red80,
//               backgroundColor: colors.red20,
//               border: `1px solid ${colors.red80}`,
//             },
//             '&.Mui-disabled': {
//               color: colors.red30,
//               borderColor: colors.red30,
//             },
//           },
//         },
//         {
//           props: { variant: 'outlined', color: 'warning' },
//           style: {
//             color: colors.orange90,
//             border: `1px solid ${colors.orange90}`,
//             ':hover': {
//               color: colors.orange80,
//               backgroundColor: colors.orange20,
//               border: `1px solid ${colors.orange80}`,
//             },
//             '&.Mui-disabled': {
//               color: colors.orange30,
//               borderColor: colors.orange30,
//             },
//           },
//         },
//         {
//           props: { variant: 'text' },
//           style: {
//             color: colors.darkBlue70,
//             ':hover': {
//               background: colors.grey10,
//             },
//             '&.Mui-disabled': {
//               backgroundColor: 'transparent',
//               cursor: 'not-allowed',
//               pointerEvents: 'initial',
//             },
//           },
//         },
//         {
//           props: { variant: 'text', color: 'error' },
//           style: {
//             color: colors.darkBlue70, // intend to keep darkBlue 70 before hover
//             ':hover': {
//               backgroundColor: colors.red5,
//               color: colors.red90,
//             },
//             '&.Mui-disabled': {
//               backgroundColor: 'transparent',
//               cursor: 'not-allowed',
//               pointerEvents: 'initial',
//             },
//           },
//         },
//         {
//           props: { variant: 'text', size: 'sm' },
//           style: {
//             padding: '8px 12px',
//           },
//         },
//       ],
//     },
//     // Checkbox styles
//     MuiCheckbox: {
//       variants: [
//         {
//           props: { size: 'small' },
//           style: {
//             width: 16,
//             height: 16,
//           },
//         },
//         {
//           props: { size: 'medium' },
//           style: {
//             width: 20,
//             height: 20,
//           },
//         },
//       ],
//       defaultProps: {
//         size: 'medium',
//         // indeterminateIcon: (
//         //   <Box
//         //     sx={{
//         //       width: '100%',
//         //       height: '100%',
//         //       background: colors.grey80,
//         //       display: 'flex',
//         //       justifyContent: 'center',
//         //       alignItems: 'center',
//         //       borderRadius: '4px',
//         //       border: `1px solid ${colors.grey80}`,
//         //     }}
//         //   >
//         //     <Icon icon={'minus'} sx={{ color: 'white' }} size={12} />
//         //   </Box>
//         // ),
//         // icon: (
//         //   <Box
//         //     sx={{
//         //       width: '100%',
//         //       height: '100%',
//         //       background: colors.white,
//         //       display: 'flex',
//         //       justifyContent: 'center',
//         //       alignItems: 'center',
//         //       borderRadius: '4px',
//         //       border: `1px solid ${colors.grey30}`,
//         //     }}
//         //   />
//         // ),
//         // checkedIcon: (
//         //   <Box
//         //     sx={{
//         //       width: '100%',
//         //       height: '100%',
//         //       background: colors.blue90,
//         //       display: 'flex',
//         //       justifyContent: 'center',
//         //       alignItems: 'center',
//         //       borderRadius: '4px',
//         //       border: `1px solid ${colors.blue90}`,
//         //     }}
//         //   >
//         //     <Icon icon={'check-single'} sx={{ color: 'white' }} size={12} />
//         //   </Box>
//         // ),
//       },
//       styleOverrides: {
//         root: {
//           padding: '2px',
//           '& > .MuiSvgIcon-root': {
//             fill: colors.grey30,
//           },
//           ':hover': {
//             '& > .MuiSvgIcon-root': {
//               fill: colors.blue90,
//             },
//           },
//           '&.MuiCheckbox-indeterminate > .MuiSvgIcon-root': {
//             fill: colors.grey80,
//           },
//           '&.Mui-checked > .MuiSvgIcon-root': {
//             fill: colors.blue90,
//           },
//           '&.Mui-checked:hover': {
//             borderTopRightRadius: '5px',
//             borderTopLeftRadius: '5px',
//             borderBottomRightRadius: '5px',
//             borderBottomLeftRadius: '5px',
//             padding: '2px',
//             backgroundColor: 'rgba(0, 102, 255, 0.1)',
//           },
//         },
//       },
//     },
//     // Switch styles
//     MuiSwitch: {
//       styleOverrides: {
//         root: {
//           width: '26px',
//           height: '16px',
//           padding: 0,
//           display: 'flex',
//         },
//         switchBase: {
//           padding: 2,
//           '&.Mui-checked.Mui-disabled': {
//             color: '#fff',
//           },
//           '&.Mui-checked.Mui-disabled + .MuiSwitch-track': {
//             backgroundColor: colors.forest30,
//           },
//           '&.Mui-checked': {
//             transform: 'translateX(10px)',
//             color: '#fff',
//             '& + .MuiSwitch-track': {
//               opacity: 1,
//               backgroundColor: colors.forest90,
//             },
//           },
//         },
//         thumb: {
//           boxShadow: 'none',
//           width: 12,
//           height: 12,
//           borderRadius: 6,
//         },
//         track: {
//           borderRadius: 16 / 2,
//           opacity: 1,
//           backgroundColor: colors.grey30,
//           boxSizing: 'border-box',
//         },
//       },
//     },
//     // Menu styles
//     MuiMenu: {
//       styleOverrides: {
//         root: {
//           '& > .MuiPaper-root': {
//             boxShadow: '0px 8px 32px 2px rgba(0, 102, 255, 0.1)',
//           },
//         },
//         list: {
//           padding: '12px 0 4px 0',
//           minWidth: '120px',
//         },
//       },
//     },
//     MuiMenuItem: {
//       styleOverrides: {
//         root: {
//           ...typography.body1,
//           backgroundColor: colors.white,
//           '&.Mui-selected': {
//             backgroundColor: colors.blue5,
//             color: colors.blue90,
//             '&:hover': {
//               backgroundColor: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//           '&.Mui-focusVisible': {
//             backgroundColor: `${colors.blue5} !important`,
//             color: colors.blue90,
//             '&:hover': {
//               backgroundColor: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//           '&:hover': {
//             color: colors.blue90,
//             backgroundColor: colors.blue5,
//           },
//           '&:focus': {
//             color: colors.blue90,
//             backgroundColor: colors.blue5,
//           },

//           padding: '8px 12px',
//           minHeight: 'unset',
//           marginBottom: '8px',
//         },
//       },
//     },
//     // Icon button styles
//     MuiIconButton: {
//       defaultProps: {
//         size: 'md',
//       },
//       styleOverrides: {
//         root: {
//           '&.Mui-disabled': {
//             color: colors.darkBlue40,
//             pointerEvents: 'auto', // ref: https://stackoverflow.com/questions/61115913/is-it-possible-to-render-a-tooltip-on-a-disabled-mui-button-within-a-buttongroup
//           },

//           color: colors.darkBlue70,
//           '&:hover': {
//             backgroundColor: colors.grey20,
//           },
//           '&:focus': {
//             backgroundColor: colors.grey20,
//           },
//         },
//       },
//       variants: [
//         {
//           props: { size: 'xs' },
//           style: {
//             padding: '2px',
//             height: '16px',
//             width: '16px',
//             borderRadius: '4px',
//           },
//         },
//         {
//           props: { size: 'sm' },
//           style: {
//             padding: '4px',
//             height: '24px',
//             width: '24px',
//             borderRadius: '6px',
//           },
//         },
//         {
//           props: { size: 'md' },
//           style: {
//             padding: '4px',
//             height: '28px',
//             width: '28px',
//             borderRadius: '8px',
//           },
//         },
//       ],
//     },
//     // List item text styles
//     MuiListItemText: {
//       styleOverrides: {
//         root: {
//           margin: 0,
//         },
//       },
//     },
//     // Table styles
//     MuiTableContainer: {
//       styleOverrides: {
//         root: {
//           boxShadow: 'unset',
//         },
//       },
//     },
//     MuiTableHead: {
//       styleOverrides: {
//         root: {
//           ...typography.headline4,
//           '&:hover': {
//             backgroundColor: 'none',
//           },
//           background: colors.grey5,
//         },
//       },
//     },
//     MuiTableRow: {
//       variants: [
//         {
//           props: { selected: true },
//           style: {
//             fontWeight: 600,
//           },
//         },
//       ],
//       styleOverrides: {
//         head: {
//           '&:hover': {
//             backgroundColor: 'unset',
//           },
//         },
//         root: {
//           height: '48px',
//           '&.Mui-selected': {
//             backgroundColor: colors.blue10,
//             '&:hover': {
//               backgroundColor: colors.blue10,
//             },
//           },
//           '&:hover': {
//             backgroundColor: colors.blue10,
//           },
//         },
//       },
//     },
//     MuiTableBody: {
//       styleOverrides: {
//         root: {
//           ...typography.body2,
//           color: colors.darkBlue90,
//         },
//       },
//     },
//     MuiTableCell: {
//       styleOverrides: {
//         root: {
//           whiteSpace: 'nowrap',
//           color: 'inherit',
//           borderBottom: `1px solid ${colors.grey10}`,
//           fontFamily: 'inherit',
//           fontSize: 'inherit',
//           fontWeight: 'inherit',
//           lineHeight: 'inherit',
//           padding: '0px 12px',
//         },
//       },
//     },

//     // pagination style
//     MuiPagination: {
//       defaultProps: {
//         shape: 'rounded',
//         showFirstButton: true,
//         showLastButton: true,
//       },
//       styleOverrides: {
//         root: {
//           ...typography.menu2,
//           button: {
//             '&.MuiPaginationItem-root.Mui-selected': {
//               color: 'white',
//               background: colors.blue90,
//             },
//             '&:hover': {
//               background: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//         },
//       },
//     },
//     MuiPaginationItem: {
//       // defaultProps: {
//       //   components: {
//       //     first: () => <Icon icon="chevron-left-double" size="16px" />,
//       //     last: () => <Icon icon="chevron-right-double" size="16px" />,
//       //     next: () => <Icon icon="chevron-right" size="16px" />,
//       //     previous: () => <Icon icon="chevron-left" size="16px" />,
//       //   },
//       // },
//       styleOverrides: {
//         root: {
//           ...typography.menu2,
//           color: colors.darkBlue70,
//         },
//       },
//     },
//     MuiTooltip: {
//       defaultProps: {
//         enterDelay: 250,
//         enterNextDelay: 250,
//       },
//       styleOverrides: {
//         tooltip: {
//           ...typography.body2,
//           padding: '12px 16px',
//           borderRadius: '4px',
//           color: colors.white,
//           background: colors.darkBlue70,
//         },
//       },
//     },
//     MuiBadge: {
//       styleOverrides: {
//         badge: {
//           ...typography.menu2,
//           padding: '4px',
//         },
//       },
//       variants: [
//         {
//           props: { color: 'info' },
//           style: {
//             '& .MuiBadge-badge': {
//               backgroundColor: colors.blue90,
//             },
//           },
//         },
//         {
//           props: { color: 'error' },
//           style: {
//             '& .MuiBadge-badge': {
//               backgroundColor: colors.red80,
//             },
//           },
//         },
//       ],
//     },
//     MuiSkeleton: {
//       styleOverrides: {
//         root: {
//           backgroundColor: colors.grey20,
//         },
//       },
//       variants: [
//         {
//           props: { variant: 'rectangular' },
//           style: {
//             borderRadius: '4px',
//           },
//         },
//       ],
//     },
//     MuiRadio: {
//       styleOverrides: {
//         root: {
//           padding: 0,
//           color: colors.grey30,
//           '&.Mui-checked': {
//             backgroundColor: colors.blue5,
//             color: colors.blue90,
//           },
//           width: '20px',
//           height: '20px',
//         },
//       },
//     },
//     MuiAvatar: {
//       styleOverrides: {
//         root: {
//           ...typography.menu2,
//         },
//       },
//       defaultProps: {
//         sizes: 'md',
//       },
//       variants: [
//         {
//           props: { sizes: 'sm' },
//           style: {
//             width: '24px',
//             height: '24px',
//           },
//         },
//         {
//           props: { sizes: 'md' },
//           style: {
//             width: '32px',
//             height: '32px',
//           },
//         },
//         {
//           props: { sizes: 'lg' },
//           style: {
//             width: '40px',
//             height: '40px',
//           },
//         },
//       ],
//     },
//     MuiAlert: {
//       defaultProps: {
//         color: 'info',
//         // slots: {
//         //   closeIcon: () => <Icon icon="x-close" size={20} sx={{ mr: '2px' }} />,
//         // },
//       },
//       // Remove default padding for icon, message and action.
//       // Centralise the padding on root instead for better spacing control.
//       styleOverrides: {
//         root: {
//           ...typography.body1,
//           borderRadius: '8px',
//           padding: '16px 20px',
//         },
//         icon: {
//           display: 'none',
//         },
//         message: {
//           padding: 0,
//         },
//         action: {
//           padding: 0,
//           marginLeft: '30px',
//           marginRight: 0,
//           alignItems: 'center',
//           '& > .MuiButtonBase-root': {
//             ...typography.button2,
//             padding: 0,
//             color: colors.white,
//             backgroundColor: 'transparent',
//             '&:hover': {
//               backgroundColor: 'transparent',
//             },
//             '& > svg': {
//               display: 'none',
//               marginRight: '-4px',
//             },
//           },
//         },
//       },
//       variants: [
//         {
//           props: { color: 'info' },
//           style: {
//             backgroundColor: colors.darkBlue70,
//             color: colors.white,
//             '& > .MuiAlert-action': {
//               '.MuiButtonBase-root': {
//                 color: '#fff',
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'error' },
//           style: {
//             backgroundColor: colors.red5,
//             color: colors.red90,
//             '& > .MuiAlert-action': {
//               svg: {
//                 color: colors.red90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'success' },
//           style: {
//             backgroundColor: colors.forest5,
//             color: colors.forest90,
//             '& > .MuiAlert-action': {
//               svg: {
//                 color: colors.forest90,
//               },
//             },
//           },
//         },
//         {
//           props: { color: 'warning' },
//           style: {
//             backgroundColor: colors.orange20,
//             color: colors.orange90,
//             '& > .MuiAlert-action': {
//               svg: {
//                 color: colors.orange90,
//               },
//             },
//           },
//         },
//       ],
//     },
//     MuiTabs: {
//       styleOverrides: {
//         indicator: {
//           backgroundColor: colors.blue90,
//         },
//       },
//       variants: [
//         {
//           props: { indicatorColor: 'orange' },
//           style: {
//             '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
//               color: colors.orange90,
//             },
//             '& .MuiTabs-indicator': {
//               backgroundColor: colors.orange90,
//             },
//           },
//         },
//       ],
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           ...typography.headline4,
//           color: colors.darkBlue70,
//           padding: '24px 12px',
//           '&.Mui-selected': {
//             color: colors.blue90,
//           },
//         },
//       },
//     },
//     MuiStepper: {
//       styleOverrides: {
//         root: {
//           backgroundColor: colors.blue10,
//           padding: '20px',
//         },
//       },
//       // defaultProps: {
//       //   connector: <Icon icon="chevron-right" size={20} />,
//       // },
//     },
//     MuiStepLabel: {
//       styleOverrides: {
//         root: {
//           cursor: 'pointer',
//         },
//         label: {
//           ...typography.headline4,
//           color: colors.grey70,
//           '&.Mui-active': {
//             fontWeight: 600,
//           },
//         },
//         iconContainer: {
//           svg: {
//             color: 'transparent',
//             text: {
//               fill: colors.grey70,
//               fontWeight: 600,
//             },
//             border: `1px solid ${colors.grey70}`,
//             borderRadius: '50%',
//             '&.Mui-completed': {
//               color: colors.grey70,
//               border: 'none',
//             },
//             '&.Mui-active': {
//               color: colors.blue90,
//               border: 'none',
//               text: {
//                 fill: colors.white,
//               },
//             },
//           },
//         },
//       },
//       variants: [
//         {
//           props: { color: 'error' },
//           style: {
//             '.MuiStepLabel-iconContainer': {
//               svg: {
//                 '&.Mui-active': {
//                   color: colors.red90,
//                 },
//                 ':not(&.Mui-active)': {
//                   border: `1px solid ${colors.red90}`,
//                   text: {
//                     fill: colors.red90,
//                   },
//                   '&.Mui-completed': {
//                     border: 'none',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       ],
//     },
//     //Select Style
//     MuiSelect: {
//       defaultProps: {
//         autoWidth: true,
//         MenuProps: {
//           sx: {
//             '&.MuiMenu-root > .MuiPaper-root': {
//               maxHeight: '420px',
//               minWidth: 'max-content',
//             },
//           },
//           anchorOrigin: {
//             vertical: 'bottom',
//             horizontal: 'left',
//           },
//           transformOrigin: {
//             vertical: 'top',
//             horizontal: 'left',
//           },
//         },
//       },
//       variants: [
//         {
//           props: { variant: 'standard' },
//           style: {
//             '&.MuiInputBase-root > .MuiSelect-select': {
//               paddingRight: '4px !important',
//             },
//           },
//         },
//         {
//           props: {
//             variant: 'outlined',
//           },
//           style: {
//             paddingRight: '12px',
//           },
//         },
//       ],
//       styleOverrides: {
//         select: {
//           color: colors.grey90,
//           background: 'transparent',
//         },
//       },
//     },
//     MuiGrid: {
//       styleOverrides: {
//         root: {
//           marginBottom: '16px'
//         }
//       }
//     },
//     MuiAutocomplete: {
//       defaultProps: {
//         // popupIcon: (
//         //   <Icon icon="chevron-down" size={20} sx={{ color: colors.grey90 }} />
//         // ),
//       },
//       styleOverrides: {
//         paper: {
//           paddingBottom: 0,
//           overflowX: 'hidden',
//           marginTop: '5px',
//           width: 'max-content',
//           minWidth: '240px',

//           '& > .MuiAutocomplete-listbox': {
//             width: 'max-content',
//             minWidth: '240px',
//             paddingBottom: 0,
//           },
//           '& > .MuiAutocomplete-listbox li': {
//             backgroundColor: colors.white,
//             minWidth: 'max-content',
//             ':hover': {
//               backgroundColor: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//           '& > .MuiAutocomplete-listbox li[aria-selected="true"]': {
//             backgroundColor: `${colors.blue5} !important`,
//             color: colors.blue90,
//             minWidth: 'max-content',
//             ':hover': {
//               backgroundColor: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//           '& > .MuiAutocomplete-listbox li.Mui-focused': {
//             backgroundColor: colors.blue5,
//             color: colors.blue90,
//             minWidth: 'max-content',
//             ':hover': {
//               backgroundColor: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//           '& > .MuiAutocomplete-listbox li.Mui-focusVisible': {
//             backgroundColor: `${colors.blue5} !important`,
//             color: colors.blue90,
//             minWidth: 'max-content',
//             ':hover': {
//               backgroundColor: colors.blue5,
//               color: colors.blue90,
//             },
//           },
//         },
//       },
//     },
//     MuiCircularProgress: {
//       defaultProps: {
//         size: 18,
//       },
//       styleOverrides: {
//         colorPrimary: {
//           color: colors.grey90,
//         },
//       },
//     },
//   },
//   //breakpoint styles
//   breakpoints: {
//     values: {
//       xs: 0,
//       md: 768,
//       lg: 1365,
//     },
//   },
//   // table sizes
//   table: {
//     columnSizes: {
//       xxs: 44,
//       xs: 96,
//       sm: 120,
//       md: 160,
//       lg: 200,
//       xl: 240,
//     },
//   },
// });

// export default theme;

export {}