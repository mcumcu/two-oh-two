
# two-oh-two

A simple implementation of a long-running asynchronous API call using HTTP status code *202 - Accepted*.

![alt text](http://bit.ly/2IOSgNa "Long running")

**Has your REST API ever had to depend on a long-running process (perhaps a third-party microservice)? How can the API provide a standards-based way to handle this scenario?**

### Reasoning ###
- Given that RESTful APIs usually adhere to a _request -> response_ pattern between the client and the API &mdash; the API consumes one request, and provides one response,
- Therefore, the client should implement a standards-based pattern to consume the API's response &mdash; no cheating by "customizing" the client, using sockets, or by inventing proprietary application protocols,
- Therefore, the server will implement the following pattern:

 `GET /deferredjob` &rarr; `GET /monitor` &rarr; `GET /result`

### Implementation  Details ###
The example is implemented in node.js with the restify package.
1.  client: GET &rarr; `/deferredjob`
2.  server: `202`, location: `/monitor/:job_id`. This tells the client that the job has started, but the result will eventually be available. The client knows when the results are available by periodically checking `/monitor/:job_id`, found in the header's `Location:`.
3.  client: GET &rarr; `/monitor/:job_id`
  - if `201`, then the long-running job is complete, GET the final results at `/result/:job_id`, found in the header's `Location:`.
  - if `200`, then the job is not complete, try again (GET &rarr; `/monitor/:job_id`) in the future.
4. client: repeat Step 3 until job is finished and server provides `201 - Created`
5. client: GET &rarr; `/result/:job_id` to get the results of the long-running job.

### Run ###
1. `$ git clone git@github.com:mcumcu/two-oh-two.git && cd two-oh-two`  
2. `$ npm install`  
3. `$ node index.js` ( start server )  
4. `^C` ( quit server )  
5. `$ npm test` ( run mocha/chai test )

### Test ###
A basic test is included. It tries to determine if:
1.  the API allows for a client to start a long-running job,
2.  the API provides a way for the client to determine if the results of the long-running job are available, and,
3.  the server should provide those results to the client when thay are available

###### Contact ######

Christopher Unger |
https://christopherunger.com |
jobs@christopherunger.com
