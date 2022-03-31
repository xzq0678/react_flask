export const LoadingReducer = (prevState = {
    isLoading: false
}, action) => {
    // console.log(action)
    let { type,payload } = action
    // console.log(payload)
    switch(type){
        case "change_loading":
            let newstate = {...prevState}
            newstate.isLoading = payload
            return newstate
        default:
            return prevState

    }
}