export const registerFormRules = {
    username: {
        isRequired: true,
        regex: /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        regexErrorText: 'Username should be 8-20 characters long, only letters and numbers are allowed.'
    },
    email: {
        isRequired: true,
        regex: /^(?![_.-0-9])[a-zA-Z0-9._-]{8,20}@[a-z]{3,}\.[a-z]{2,}$/,
        regexErrorText: 'Email is invalid.'
    },
    password: {
        isRequired: true,
        regex: /^(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[0-9].*)[a-zA-Z0-9@#._-]{8,}$/,
        regexErrorText: 'Password must be 8 characters minimum, at least one uppercase letter, one lowercase letter and one number.'
    },
    password2: {
        isRequired: true,
        name: 'Password confirmation'
    }
}