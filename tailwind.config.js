/** @type {import('tailwindcss').Config} */

module.exports = {
  theme: {
    extend: {
      // Customize typography for prose to match the theme colors/sizes/etc.
      // By default, prose uses a custom font-size, line-height, and color.
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.black'),
            fontSize: theme('fontSize.base'),
            lineHeight: theme('lineHeight.normal'),
            maxWidth: 'none',
            h1: {
              color: theme('colors.black'),
            },
            h2: {
              color: theme('colors.black'),
            },
            h3: {
              color: theme('colors.black'),
            },
            h4: {
              color: theme('colors.black'),
            },
            h5: {
              color: theme('colors.black'),
            },
            h6: {
              color: theme('colors.black'),
            },
            '--tw-prose-body': theme('colors.black'),
            '--tw-prose-headings': theme('colors.black'),
            '--tw-prose-lead': theme('colors.black'),
            '--tw-prose-links': theme('colors.black'),
            '--tw-prose-bold': theme('colors.black'),
            '--tw-prose-counters': theme('colors.black'),
            '--tw-prose-bullets': theme('colors.black'),
            '--tw-prose-hr': theme('colors.black'),
            '--tw-prose-quotes': theme('colors.black'),
            '--tw-prose-quote-borders': theme('colors.black'),
            '--tw-prose-captions': theme('colors.black'),
            '--tw-prose-code': theme('colors.black'),
            '--tw-prose-pre-code': theme('colors.black'),
            '--tw-prose-pre-bg': theme('colors.black'),
            '--tw-prose-th-borders': theme('colors.black'),
            '--tw-prose-td-borders': theme('colors.black'),
          },
        },
      }),
    },
  },
};
