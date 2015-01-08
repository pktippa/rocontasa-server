# webapp
Nodejs Backend
  * Web UI and Service layer
 
How to Run
  * Open terminal/command prompt
  * Change the directory to the application source directory. 
    Ex: Linux - cd /home/user2/detektor.nodejs/
 		Windows - cd C:/Users/user2/detektor.nodejs/
  * Install dependencies by running "npm install"
  * Start Server 'nohup node app.js &' - The server will run on default port at 80 and connects to local mongodb running in 27017 port.
  * To test, run below curl to add a record to the mongodb
       curl -X POST -H "Content-type: application/json" -d '{"samplerecord":1}' http://localhost/detektor/detect
    Connect to mongo by running mongo client and get the mongo shell:
       mongo
    List the databases by running below command in teh mongo shell:
       show dbs;
    To Select 'detektor' database:
       use detektor;
    To list all the collections in the 'detektor' database:
       show collections;
    To list all the records in the 'pitholedetections' collection:
       db.getCollection('pitholedetections').find()

How to upgrade server

  * After logging into the machine, switch to root user - sudo su.
  * Stop server - kill -9 <node-process>
  * Go to /root/detektor.nodejs/
  * Run 'git stash' to remove local changes
  * Run 'git pull' to get latest code.
  * Start server 'nohup node app.js &'