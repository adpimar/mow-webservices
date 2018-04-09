import { RESTAURANT_ITEM_SELECTION } from '../actions/types';

const INITIAL_STATE = {
    id: -1,
    name: '',
    type: '',
    image: '',
    description: '',
    categories: null
};

const passRestaurantPropsToState = (state, action) => {
    const { id, name, type, thumbnail_image, description, categories } = action.payload;
    const newState = { ...state, ...INITIAL_STATE };

    newState.id = id;
    newState.name = name;
    newState.type = type;
    newState.image = thumbnail_image;
    newState.description = description;
    newState.categories = categories;

    return newState;
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESTAURANT_ITEM_SELECTION:
            return passRestaurantPropsToState(state, action);
        default:
            return state;
    }
};
