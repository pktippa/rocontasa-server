# Rocontasa - Webapp and service layer in Nodejs [![Build Status](https://travis-ci.org/rocontasa/wappservice.png)](https://travis-ci.org/rocontasa/wappservice)
Nodejs Backend
  * Web UI and Service layer
How to clone
  * Run command in the application source directory
    git clone https://github.com/rocontasa/wappservice
How to Run
  * Open terminal/command prompt
  * Change the directory to the application source directory. 
    Ex: Linux - cd /home/user2/wappservice/
 		Windows - cd C:/Users/user2/wappservice/
  * Install dependencies by running "npm install"
  * Start Server 'nohup node app.js &' - The server will run on default port at 80 and connects to local mongodb running in 27017 port.
  * To test
    Open ./sampledata/sample_file_upload.html in browser, chose file as ./sampledata/sample_data.gz and click Upload file, should get response as "File Uploaded" 
    Connect to mongo by running mongo client and get the mongo shell:
       mongo
    List the databases by running below command in teh mongo shell:
       show dbs;
    To Select 'rocontasa' database:
       use rocontasa;
    To list all the collections in the 'rocontasa' database:
       show collections;
    To list all the records in the 'data' collection:
       db.getCollection('data').find()

How to upgrade server

  * After logging into the machine, switch to root user - sudo su.
  * Stop server - kill -9 <node-process>
  * Go to /root/wappservice/
  * Run 'git stash' to remove local changes
  * Run 'git pull' to get latest code.
  * Start server 'nohup node app.js &'

### For development environment ###
   * Change host property value to "localhost" in ./config/dbconfig.js
