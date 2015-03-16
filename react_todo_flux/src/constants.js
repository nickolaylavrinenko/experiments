
const actionTypes = {
    'ADD_ITEM': 'APP.LIST.ADD_ITEM',
    'MOVE_ITEM': 'APP.LIST.MOVE_ITEM',
    'SET_ITEM_STATE': 'APP.ITEM.SET_STATE',
};

const itemStates = {
    'ACTIVE': 'active',
    'MODIFICATION': 'modification',
    'DONE': 'done',
    'REMOVED': 'removed'
};

const filterTypes = {
    'ALL': 'all',
    'ACTIVE': 'active',
    'OUTDATED': 'outdated',
    'DONE': 'done',
    'REMOVED': 'removed'
};


const dragDropTypes = {
    'ITEM': 'item'
};

export {
    actionTypes,
    itemStates,
    filterTypes,
    dragDropTypes,
};
