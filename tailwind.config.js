/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        colors: {
            'white': '#fff',
            'orange-1': '#FF7B00',
            'orange-2': '#FF9533',
            'orange-3': '#FFAA00',
            'orange-4': '#FFEECC',
            'orange-5': '#F5F3EFCC',
            'black-4': 'rgb(84, 88, 99, 0.6)',
            'black-3': 'rgb(62, 63, 75, 0.7)',
            'black-2': 'rgb(52, 55, 62, 0.9)',
            'form-label-color': 'rgb(51, 54, 63, 0.8)',
            'form-field-background-color': 'rgba(229, 229, 229, 0.3)',
            'form-field-placeholder-color': 'rgb(84, 88, 99, 0.6)',
            'weird-blue': 'rgb(7, 42, 200)',
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
            }
        },
    },
    plugins: []
}

