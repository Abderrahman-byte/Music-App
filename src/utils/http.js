export const getCookie = (name) => {
    let value = null
    const cookies = document.cookie
    cookies.split(';').forEach(cookie => {
        const [key, val] = cookie.trim().split('=')
        if(key === name) value = val
    })

    return value
}