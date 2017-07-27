module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "linebreak-style": [
            "warn",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "semi": [
            "error",
            "always"
        ],
        "indent": 0,
        "no-console": 0,
        "no-redeclare": 0
    }
};