export function getURlParamater(ParamaterNmae) {
    const Paramaters = new URLSearchParams(window.location.search)
    return Paramaters.get(ParamaterNmae)
}

export function removeURlParamater(ParamaterNmae) {
    const Paramaters = new URLSearchParams(window.location.search)
}

export function addURLParamter(key, value) {
    const Paramaters = new URLSearchParams(window.location.search)
    Paramaters.set(key, value)
    const newRelativePath = window.location.pathname + "?" + Paramaters.toString()
    history.pushState(null, "", newRelativePath)
}