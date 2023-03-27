/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            animation: {
                "delayed-fade-out": "fade-out .3s ease-out 2.5s forwards",
                "slide-in": "slide-in .3s cubic-bezier(0.075, 0.820, 0.165, 1.000)",
                "spin-fast": "spin .5s linear infinite"
            },
            keyframes: {
                "fade-out": {
                    "from": { opacity: 1 },
                    "to": { opacity: 0 }
                },
                "slide-in": {
                    "from": { transform: "translateY(-100%)", opacity: .5 },
                    "to": { transform: "translateY(0)", opacity: 1 }
                }
            }
        }
    },
    plugins: []
}