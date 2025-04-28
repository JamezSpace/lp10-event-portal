/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        colors: {
            'white': '#fbfaf8',
            'primary': '#804e49',
            'black': '#0a122a',
            'black-tint': '#b6b8bf',
            'black-tint-1': '#ced0d4',

            'black-2': 'rgb(52, 55, 62, 0.9)',
            'form-field-placeholder-color': 'rgb(84, 88, 99, 0.6)',
            'success': '#5FC381',
            'error': '#DD524D'
        },
        fontSize: {
            'size-small': '16px',
            'size-normal': '20px',
            'size-heading': '24px'
        },
        extend: {
            fontFamily: { 'sans-serif': 'Inter, sans-serif' },
            fontWeight: {
                'weight-400': 400,
                'weight-500': 500,
                'weight-600': 600
            },
            lineHeight: {
                'lh-normal': '30px',
                'lh-heading': '36px'
            },
            screens: {
                'non-laptop-screen': {
                    max: '768px'
                },
                'phone-screen': {
                    max: '465px'
                }
            }
        },
    },
    plugins: []
}

