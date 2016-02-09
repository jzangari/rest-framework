#rest-framework
Playground for developing a down and dirty, rest centric node framework.

##app.js
Main file for the system, where the resources, filters, and server are setup. 

##rest-api
Hopefully this will be a module one day. 
###rest-api.js
This is the main file for what will eventually be the entry point to a module. I handles the request, runs the filters, dispatches. 
###resource.js
This is an interesting file. It's a map from HTTP Method to function that relies on calling a passed in service to fullfill the base purpose of the method. POSTs save in the collection, GETs get by ID, get all, or search , PUTs upgrade, DELETEs remove from the collection. 
###response-builder.js
The fledgeling beginnings of what I want to build out into a response building suit based on the accept http header. For now.. it does less. 
###error.js
Defines an error class, I plan on building more of these classes to use in a code smell driven refactor. 

##resources
This is where I will put the "classes" that act as a map between the framework and a service method. 

##services
Business logic, crud, etc. Service level code. 

##test
Will be where the unit and integration tests live.. eventually. 


