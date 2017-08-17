export let fixedMenuItemsList =
[
    {
        name: "Pagination",
        id: "section/Pagination",
        items: []
    },
    {
        name: "JSONP",
        id: "section/JSONP",
        items: []
    },
    {
        name: "Authentication",
        id: "section/Authentication",
        items: []
    },
    {
        name: "pet",
        id: "tag/pet",
        items: [
            {
            	name: "Deletes a pet",
            	id: "/paths/~1pet~1{petId}/delete",
            	metadata: {operation: "delete"}
            },
            {
            	name: "Find pet by ID",
            	id: "/paths/~1pet~1{petId}/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Finds Pets by status",
            	id: "/paths/~1pet~1findByStatus/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Finds Pets by tags",
            	id: "/paths/~1pet~1findByTags/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Add a new pet to the store",
            	id: "/paths/~1pet/post",
            	metadata: {operation: "post"}
            },
            {
            	name: "Updates a pet in the store with form data",
            	id: "/paths/~1pet~1{petId}/post",
            	metadata: {operation: "post"}
            },
            {
            	name: "uploads an image",
            	id: "/paths/~1pet~1{petId}~1uploadImage/post",
            	metadata: {operation: "post"}
            },
            {
            	name: "Update an existing pet",
            	id: "/paths/~1pet/put",
            	metadata: {operation: "put"}
            }
        ]
    },
    {
        name: "store",
        id: "tag/store",
        items: [
            {
            	name: "Delete purchase order by ID",
            	id: "/paths/~1store~1order~1{orderId}/delete",
            	metadata: {operation: "delete"}
            },
            {
            	name: "Find purchase order by ID",
            	id: "/paths/~1store~1order~1{orderId}/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Returns pet inventories by status",
            	id: "/paths/~1store~1inventory/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Place an order for a pet",
            	id: "/paths/~1store~1order/post",
            	metadata: {operation: "post"}
            }
        ]
    },
    {
        name: "user",
        id: "tag/user",
        items: [
            {
            	name: "Delete user",
            	id: "/paths/~1user~1{username}/delete",
            	metadata: {operation: "delete"}
            },
            {
            	name: "Get user by user name",
            	id: "/paths/~1user~1{username}/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Logs out current logged in user session",
            	id: "/paths/~1user~1logout/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Logs user into the system",
            	id: "/paths/~1user~1login/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Create user",
            	id: "/paths/~1user/post",
            	metadata: {operation: "post"}
            },
            {
            	name: "Creates list of users with given input array",
            	id: "/paths/~1user~1createWithArray/post",
            	metadata: {operation: "post"}
            },
            {
            	name: "Creates list of users with given input array",
            	id: "/paths/~1user~1createWithList/post",
            	metadata: {operation: "post"}
            },
            {
            	name: "Updated user",
            	id: "/paths/~1user~1{username}/put",
            	metadata: {operation: "put"}
            }
        ]
    },
    {
        name: "Pagination",
        id: "tag/Pagination",
        items: [
            {
            	name: "Finds Pets by status",
            	id: "/paths/~1pet~1findByStatus/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Finds Pets by tags",
            	id: "/paths/~1pet~1findByTags/get",
            	metadata: {operation: "get"}
            }
        ]
    },
    {
        name: "JSONP",
        id: "tag/JSONP",
        items: [
            {
            	name: "Find pet by ID",
            	id: "/paths/~1pet~1{petId}/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Find purchase order by ID",
            	id: "/paths/~1store~1order~1{orderId}/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Finds Pets by status",
            	id: "/paths/~1pet~1findByStatus/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Finds Pets by tags",
            	id: "/paths/~1pet~1findByTags/get",
            	metadata: {operation: "get"}
            },
            {
            	name: "Get user by user name",
            	id: "/paths/~1user~1{username}/get",
            	metadata: {operation: "post"}
            },
            {
            	name: "Returns pet inventories by status",
            	id: "/paths/~1store~1inventory/get",
            	metadata: {operation: "post"}
            }
        ]
    }
];