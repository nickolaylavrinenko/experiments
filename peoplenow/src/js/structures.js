
function Tags( args ) {
    args = args || {};
    this.___class = "Tags";
                                        
    this.title = args.title || "";
                                                
    this.updated = args.updated || "";
                                                
    this.created = args.created || "";
                                                
    this.ownerId = args.ownerId || "";
                                                
    this.desc = args.desc || "";
                                                
    this.objectId = args.objectId || "";
                                                
    var storage = Backendless.Persistence.of( Tags );

    this.save = function ( async )
    {
        storage.save( this, async );
    };

    this.remove = function ( async )
    {
        var result = storage.remove( this, async );
        this.objectId = null;
        return result;
    };                                      
};

function CustomUser( args ) {
    args = args || {};
    this.___class = "CustomUser";
                                        
    this.objectId = args.objectId || "";
                                                
    this.created = args.created || "";
                                                
    this.email = args.email || "";
                                                
    this.ownerId = args.ownerId || "";
                                                
    this.updated = args.updated || "";
                                                
    this.tags = args.tags || "";
                                                
    this.name = args.name || "";
                                                
    this.fbuid = args.fbuid || "";
                                                
    var storage = Backendless.Persistence.of( CustomUser );

    this.save = function ( async )
    {
        storage.save( this, async );
    };

    this.remove = function ( async )
    {
        var result = storage.remove( this, async );
        this.objectId = null;
        return result;
    };                                        
};


module.exports = {
  'Tags': Tags,
  'CustomUser': CustomUser,
};