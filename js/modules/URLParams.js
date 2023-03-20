export function getURlParamater(ParamaterNmae) {
    const Paramaters = new URLSearchParams(window.location.search)
    return Paramaters.get(ParamaterNmae)
}

export function removeURlParamater(ParamaterName) {
    const Paramaters = new URLSearchParams(window.location.search)
    Paramaters.delete(ParamaterName);
    const updatedURL = window.location.origin + window.location.pathname + '?' + Paramaters.toString();
    return updatedURL;
}

export function addURLParamter(key, value) {
    const Paramaters = new URLSearchParams(window.location.search)
    Paramaters.set(key, value)
    const newRelativePath = window.location.pathname + "?" + Paramaters.toString()
    history.pushState(null, "", newRelativePath)
}