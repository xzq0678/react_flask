export const SearchReducer = (prevState = {
    searchTarget: 'sh600000'
}, action) => {
    // console.log(action)
    let { type, payload } = action
    // console.log(payload)
    switch(type){
        case "search_stockinfo":
            let newstate = {...prevState}
            newstate.searchTarget = payload
            return newstate
        default:
            return prevState

    }
}