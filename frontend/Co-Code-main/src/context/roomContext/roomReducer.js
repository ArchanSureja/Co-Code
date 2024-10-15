export const initialRoomState = {
    roomId: '',
    createdBy: { username: '' },
    participants: [],
    messages: [],
    contents: ""
};

export const roomReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ROOM':
            return { ...state, ...action.payload };
        case 'ADD_PARTICIPANT':
            return { ...state, participants: [...state.participants, action.payload] };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'ADD_CONTENT':
            return { ...state, contents: [...state.contents, action.payload] };
        case 'REMOVE_PARTICIPANT':
            return {
                ...state,
                participants: state.participants.filter(participant => participant.username !== action.payload.username)
            };
        case 'REMOVE_CONTENT':
            return {
                ...state,
                contents: state.contents.filter(content => content.contentName!== action.payload.contentName)
            }
        default:
            return state;
    }
};
