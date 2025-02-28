export const initialStore=()=>{
  return{
    user: null,
    token: null,
    error: null,
    emailError: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_user':
      return{
        ...store,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'logout':
      return{
        ...store,
        user: null,
        token: null,
        error: null,
      };
    case 'set_error':
      return{
        ...store,
        error: action.payload.error,
      };
    case 'set_email_error':
      return{
        ...store,
        emailError: action.payload.emailError,
      };
    default:
      console.error("Unkown action type");
      return store;
  }    
}


