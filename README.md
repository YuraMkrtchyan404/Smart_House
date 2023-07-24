# Smart Home
## A simple project containting Rest API's for a "Smart Home"

This is an educational project, which was built by using the following tools:
* Typescript
* Express
* RabbitMQ
* PostgreSQL
* HTML/CSS/JS
* Docker

The project containts **3 microservices**:
* api
* house
* owner

The project has **registration/login** (implemented with *JWT token*) page, and **dashboard** page.

After logging in, the owner has the opportunities to do the following actions:
* Register new House
* Get the information about a specific house by entering house_id
* Get the information about all their houses
* Get the window list of one of their houses by entering house_id
* Add a new window to a house
* OPEN or CLOSE specific doors and windows
* Delete a house from the list of their houses 

## How to install this project

1. Clone this project
2. Have Docker installed on your local machine
3. Head to the project directory, and run - `docker-compose build`, and then `docker-compose up`
4. Access the project interface through `http://localhost:3000/owner/login`