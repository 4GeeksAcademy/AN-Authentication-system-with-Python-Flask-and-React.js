export const initialStore = () =>{
  return{
    user: null,
    token: null,
    error: null,
    emailError: null,
  };
};

export default function storeReducer(store, action = {}) {
  console.log("action recibido:", action);
  switch(action.type){
    case 'set_user':
    if(!action.payload || !action.payload.user || !action.payload.token){
      console.error("invalido para user:", action.payload);
      return store;
    }  
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
      return store;
  }    
}

