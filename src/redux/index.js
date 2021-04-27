import { GET_USER_PERMISSION } from './actionTypes'

const initialState = {
  userPermission: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_PERMISSION:
      return { ...state, userPermission: action.permission }
    default:
      return state
  }
}

export default reducer
