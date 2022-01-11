const colors = require("tailwindcss/colors");

module.exports = {
    content: ["./src/**/*.{html,js}"],
    darkMode: "class",
    theme: {
        extend: {
            spacing: {
                128: "32rem",
                144: "36rem",
                160: "40rem",
                176: "44rem",
            },
            flex: {
                2: "2 2 0%",
                3: "3 3 0%",
                4: "4 4 0%",
                5: "5 5 0%",
            },
            animation: {
                "spin-fast": "spin 500ms linear infinite",
                "spin-slow": "spin 2s linear infinite",
                "reverse-spin": "reverse-spin 1s linear infinite",
                "reverse-spin-slow": "reverse-spin 2s linear infinite",
                "reverse-spin-very-slow": "reverse-spin 3750ms linear infinite",
            },
            keyframes: {
                "reverse-spin": {
                    from: {
                        transform: "rotate(360deg)",
                    },
                    to: {
                        transform: "rotate(0deg)",
                    },
                },
            },
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            redsand: {
                50: "#F9EFED",
                100: "#F3DFDD",
                200: "#E8C2BD",
                300: "#DA9B92",
                400: "#CC7568",
                500: "#C05546",
                600: "#953F33",
                700: "#6F2F26",
                800: "#441D17",
                900: "#1D0C0A",
            },
            fadedsky: {
                50: "#EDF8F9",
                100: "#DDF1F3",
                200: "#BDE3E8",
                300: "#92D1DA",
                400: "#68C0CC",
                500: "#46B1C0",
                600: "#338995",
                700: "#26666F",
                800: "#173F44",
                900: "#0A1A1D",
            },
        },
        fontFamily: {
            display: ["Exo"],
            body: ["Barlow"],
        },
    },
    plugins: [],
};
