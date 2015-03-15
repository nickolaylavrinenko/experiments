
const itemActionTypes = {
    'ADD': 'APP.ITEM.ADD',
    'MOVE': 'APP.ITEM.MOVE',
    'DONE': 'APP.ITEM.DONE',
    'REMOVED': 'APP.ITEM.REMOVED',
};

const itemStates = {
    'ACTIVE': 'active',
    'REMOVED': 'removed',
    'DONE': 'done',
    'MODIFICATION': 'modification',
};

const filterTypes = {
    'ALL': 'all',
    'ACTIVE': 'active',
    'OUTDATED': 'outdated',
    'DONE': 'done'
};


const dragDropTypes = {
    'ITEM': 'item'
};

export {
    itemActionTypes,
    itemStates,
    filterTypes,
    dragDropTypes,
};
