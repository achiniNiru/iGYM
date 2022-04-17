export const initialState = {
    user: null,
    token: null,
    expire: null,
    snackbar: false,
    severity: "error",
    msg:"",
    loading: true
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_SNACKBAR: "SET_SNACKBAR",
    SET_LOADING: "SET_LOADING",
};

const reducer = (state, action) => {

    switch (action.type){
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
                token: action.token,
                expire: action.expire
            };
        case actionTypes.SET_SNACKBAR:
            return {
                ...state,
                snackbar: action.snackbar,
                severity: action.severity,
                msg: action.msg,
            };
        case actionTypes.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;

    }

};

export default reducer;