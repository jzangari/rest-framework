#rest-framework
Playground for developing a down and dirty, rest centric node framework.

##app.js
Main file for the system, where the resources, filters, are setup and the and server is started. 

##server.js
Independently start and run the server after intializing with a requestHandlerCallback. Probly should be one call... 

##/rest-api
Hopefully this will be a module one day. Better name. 
###rest-api.js
This is the main file for what will eventually be the entry point to a module. I handles the request, runs the filters, dispatches the request to a resource based the Resources interface (which is badly named now). 
###resource.js
This is an interesting file. It's a map from HTTP Method to function that relies on calling a passed in service to fullfill the base purpose of the method. POSTs save in the collection, GETs get by ID, get all, or search , PUTs upgrade, DELETEs remove from the collection. 
###response-builder.js
The fledgeling beginnings of what I want to build out into a response building suite based on the accept http header. For now.. it does less. 
###error.js
Defines an error class, I plan on building more of these classes to use in a code smell driven refactor. Contexts, contexts everywhere. 

##/resources
This is where I will put the "classes" that act as a map between the framework and a service method. 
###configuration-resource.js
Basic resource implementation that is essentially just a pass through to the mongo-data-access module. Shows you can put together a CRUD endpoint quickly and easily. 
###login-resource.js
Utilizes the configuration-service to process login POST requests and GET requests by token ID. This is a good example of using an resource to expose service level business logic. 
###logout-resource.js
Another resource interface to the configuration service that services PUT's. Also shows some small use of the resource layer by defaulting responses to certain HTTP Methods. 

##/services
Business logic, crud, etc. Service level code. 
###authentication-service.js
Business logic for authenticating users, granting tokens, and revoking tokens. Also includes a disabled interval for invalidating expired tokens. 

##/data
Data access logic. 
###data-access-mongo.js 
Re-useable CRUD Centric mongo usage interface with mongo query pass through, paging, and sorting. 

##/test
Will be where the unit and integration tests live.. eventually. 
###test-api.js
Right now just a few happy path test for the configuration resource. I want to flush it out to be a full scale login, logout, CRUD test suite. 


