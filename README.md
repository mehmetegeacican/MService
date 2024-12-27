# MService
A Microservice application designed for sales management.
This Markdown describes the structure of Microservices and project, how they interact with each other

### Basic Structure

The Project consists of 4 microservices

```
1. SaleService : Responsible for the Manipulation of the Sales
2. UserService : Responsible for logging in, signing up and user management
3. ClientService: Responsible for Manipulating the client data
4. API Gateway : Responsible for allowign communications between services and provide an entry point to the system
```

The structure diagram shows the architectural design of the microservices. The project follows classical api gateway based architecture

```
                      +--------------------+
                      |    API Gateway     |
                      | (Entry Point for   |
                      |   All Requests)    |
                      +--------------------+
                                |
    ------------------------------------------------------------
    |                          |                          |
+----------------+     +-----------------+       +-----------------+
| UserService    |     | ClientService   |       | SaleService     |
| (Handles User  |     | (Handles Client |       | (Handles Sale   |
| Management)    |     | Data)           |       | Data)           |
+----------------+     +-----------------+       +-----------------+
        |                       |                        |
+---------------+      +----------------+       +----------------+
| UserDB        |      | ClientDB       |       | SaleDB         |
| (Database for |      | (Database for  |       | (Database for  |
| User Data)    |      | Client Data)   |       | Sale Data)     |
+---------------+      +----------------+       +----------------+

```

### Code Structure

The Code Structure follows classical Layered Backend Architecture which follows the design that can be seeb 

```

Code Structure Overview
------------------------

+-------------------------+
|      API Layer          |
|  (Routes & Middleware)  |
| - Defines API endpoints |
| - Maps logic to routes  |
| - Adds middleware       |
+-------------------------+
            |
+-------------------------+
|     Logic Layer         |
| (Controller/Service)    |
| - Handles business logic|
| - Processes request data|
| - Creates appropriate   |
|   responses             |
+-------------------------+
            |
+-------------------------+
|      Data Layer         |
|  (Models & Schemas)     |
| - Connects to database  |
| - Defines schemas/models|
| - Transforms raw data   |
|   into usable formats   |
+-------------------------+
            |
+-------------------------+
|     Database Layer      |
| - Actual database where |
|   data is stored and    |
|   queried               |
+-------------------------+

```

### Documentations & Tests

* For each controller function, unit tests have been written. 
Various scenarios regarding the outcome have been used.
Sinon and Jest have been used. Coverage have been added also

* For API Documentation, Swagger have been used. Used for the various services
  The documents can be reached by using the respective api url of the service with adding /api-docs to the end
  
* For tests use `npm run test` in the specific service that you want to control. E.g -> in ./UserService
* For tests with coverage, use `npm run test-coverage` for seeing how much of the services have been covered for test 
